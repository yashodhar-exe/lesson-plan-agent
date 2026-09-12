import os
import json
import time
from google import genai
from google.genai import types

def generate_with_fallback(client, contents, response_mime_type="application/json"):
    max_retries = 3
    models = ['gemini-3.6-flash']
    last_error = None
    for model in models:
        for attempt in range(max_retries):
            try:
                print(f"Attempting API call with model: {model} (Attempt {attempt+1}/{max_retries})")
                return client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        response_mime_type=response_mime_type
                    )
                )
            except Exception as e:
                print(f"Model {model} failed: {e}")
                last_error = e
                error_str = str(e)
                if "429" in error_str:
                    print("Rate limit reached (429). Waiting 35 seconds before retrying...")
                    time.sleep(35)
                    continue
                elif "503" not in error_str and "404" not in error_str:
                    # If it's a different kind of error (like auth or bad request), don't fallback
                    raise e
                break # Break out of retries for this model if it's 503 or 404
    raise last_error

def parse_timetable_with_gemini(file_path: str, mime_type: str = "application/pdf"):
    """
    Uses the Gemini API to parse a timetable PDF/Image into structured JSON.
    Expected output: a list of slots, where each slot has:
    - section
    - day_of_week
    - period_number
    - course_name (or code)
    - faculty_name (if present)
    - type (LECTURE, LAB, etc.)
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")
        
    client = genai.Client(api_key=api_key)
    
    # Upload the file to Gemini
    # Note: For production with multiple files, we'd cache these, but for simplicity here we upload per request
    uploaded_file = client.files.upload(file=file_path, config={'mime_type': mime_type})
    
    prompt = """
    Extract all teaching timetable slots from this document.
    CRITICAL: This document contains multiple pages/sections. You MUST extract every single slot from EVERY section. DO NOT stop early or skip any pages.
    Return ONLY a raw JSON array of objects. Do not include markdown formatting like ```json.
    Each object must have exactly these keys:
    - "section": string (e.g. "CSE-A", "CSE-C")
    - "day_of_week": string ("Monday", "Tuesday", etc.)
    - "period_number": integer (1, 2, 3...)
    - "course_name": string (CRITICAL: Use the FULL subject name by matching acronyms in the timetable grid to the legend at the bottom, e.g., output "Computer Networks" instead of "CN")
    - "faculty_name": string (the teacher's name if listed, otherwise null)
    - "type": string (e.g. "LECTURE", "PRACTICAL", "LAB")
    
    If the timetable shows the same class across multiple adjacent periods, create a separate object for EACH period number.
    Make sure to match the faculty member and course to the correct section and time.
    """
    
    response = generate_with_fallback(client, [uploaded_file, prompt])
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON from Gemini: {response.text}")
        raise e

def parse_calendar_with_gemini(file_path: str, mime_type: str = "application/pdf"):
    """
    Uses the Gemini API to parse an academic calendar into structured JSON.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")
        
    client = genai.Client(api_key=api_key)
    uploaded_file = client.files.upload(file=file_path, config={'mime_type': mime_type})
    
    prompt = """
    Extract all significant dates from this academic calendar.
    Return ONLY a raw JSON array of objects. Do not include markdown formatting like ```json.
    Each object must have exactly these keys:
    - "date": string in YYYY-MM-DD format
    - "event_type": string. MUST be one of: "HOLIDAY", "INSTITUTIONAL_EVENT", "MIDTERM_EXAM", "INTERNAL_ASSESSMENT", "SEMESTER_START", "SEMESTER_END", "UNKNOWN"
    - "description": string (the name of the event or holiday)
    
    If an event spans multiple days (like exams), create a separate object for EACH day.
    """
    
    response = generate_with_fallback(client, [uploaded_file, prompt])
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON from Gemini: {response.text}")
        raise e

def parse_syllabus_with_gemini(file_path: str, mime_type: str = "application/pdf"):
    """
    Uses the Gemini API to parse a course syllabus into structured JSON.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")
        
    client = genai.Client(api_key=api_key)
    uploaded_file = client.files.upload(file=file_path, config={'mime_type': mime_type})
    
    prompt = """
    Extract the units, topics, and course outcomes from this syllabus.
    Return ONLY a raw JSON array of objects. Do not include markdown formatting like ```json.
    Each object represents a Unit and must have exactly these keys:
    - "unit_number": integer (1, 2, 3...)
    - "name": string (the title of the unit)
    - "notional_hours": integer (the suggested number of hours to teach this unit, default to 8 if not specified)
    - "topics": array of strings (the individual topics covered in this unit)
    """
    
    response = generate_with_fallback(client, [uploaded_file, prompt])
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON from Gemini: {response.text}")
        raise e
