import os
import ast
import re
from google import genai

class RAGAgent:
    """
    Agent 8 - Learning Resources / RAG Agent (LLM-powered Agent)
    Responsibilities: Suggest learning resources and reference materials based on topic.
    """
    
    @staticmethod
    def get_reference_materials(topic_name: str) -> list:
        """
        Uses LLM to recommend external reference materials for a given topic.
        """
        prompt = (
            f"You are a helpful teaching assistant. Provide 2 highly relevant academic "
            f"reference materials or textbooks for the computer science topic: '{topic_name}'. "
            f"Return ONLY a python list of strings."
        )
        
        try:
            client = genai.Client()
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            content = response.text.strip()
            # Attempt to safely parse a list from the LLM response
            match = re.search(r'\[.*\]', content, re.DOTALL)
            if match:
                return ast.literal_eval(match.group(0))
            return [content]
        except Exception as e:
            error_str = str(e)
            if "503" in error_str:
                print("Gemini 503 persists in Agent 8. Falling back to Groq...")
                try:
                    from app.tools.groq_fallback import call_groq_api
                    content = call_groq_api(prompt, is_json=False).strip()
                    match = re.search(r'\[.*\]', content, re.DOTALL)
                    if match:
                        return ast.literal_eval(match.group(0))
                    return [content]
                except Exception as groq_e:
                    print(f"Groq fallback also failed: {groq_e}")
                    
            # Fallback
            return [f"Standard Textbook for {topic_name}", "Online Documentation"]
