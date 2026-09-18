import requests
import json
import os

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def call_groq_api(prompt, text=None, is_json=True):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    content = prompt
    if text:
        content += f"\n\nDocument Text:\n{text}"
        
    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "user", "content": content}
        ]
    }
    if is_json:
        data["response_format"] = {"type": "json_object"}
    
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def fallback_parse_pdf_with_groq(file_path: str, prompt: str):
    text = ""
    try:
        import fitz
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Failed to extract text from PDF for Groq fallback: {e}")
        return "{}"
        
    return call_groq_api(prompt, text)
