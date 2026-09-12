import re
from datetime import datetime, timedelta
import pdfplumber
import cv2
import numpy as np
try:
    import pytesseract
except ImportError:
    pytesseract = None

class CalendarParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        
    def parse(self):
        text = self.extract_text()
        return self.extract_events(text)
        
    def extract_text(self) -> str:
        text = ""
        try:
            with pdfplumber.open(self.file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"PDF text extraction failed: {e}")
            
        if not text.strip() and pytesseract:
            # Fallback to OCR if text is empty
            print("Falling back to OCR...")
            # Simple mock for hackathon OCR extraction
            text = "Mocked OCR Text: Holidays on 2026-10-02"
            
        return text

    def extract_events(self, text: str):
        # In a real scenario, this would use NLP or regex to parse dates, events, etc.
        # For the hackathon, we'll return a structured list of mock events if parsing fails,
        # or implement basic regex for dates.
        events = []
        # Find basic YYYY-MM-DD dates in text
        date_pattern = r"(\d{4}-\d{2}-\d{2})\s*-\s*([A-Za-z ]+)"
        matches = re.findall(date_pattern, text)
        for date_str, desc in matches:
            event_type = "UNKNOWN"
            desc_lower = desc.lower()
            if "holiday" in desc_lower:
                event_type = "HOLIDAY"
            elif "exam" in desc_lower or "mid-term" in desc_lower or "midterm" in desc_lower:
                event_type = "MIDTERM_EXAM"
            elif "event" in desc_lower:
                event_type = "INSTITUTIONAL_EVENT"
            events.append({
                "date": datetime.strptime(date_str, "%Y-%m-%d").date(),
                "event_type": event_type,
                "description": desc.strip()
            })
            
        return events
