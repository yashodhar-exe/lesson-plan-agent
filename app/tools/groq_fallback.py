import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()
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
        "model": "openai/gpt-oss-20b",
        "messages": [
            {"role": "user", "content": content}
        ]
    }
    if is_json:
        data["response_format"] = {"type": "json_object"}
    
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

