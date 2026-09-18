import os
from google import genai

def get_agent_6():
    return {"name": "variance_agent"}

def generate_replanning_recommendation(agent, variance_data):
    """
    Calls Agent 6 to generate a recommendation.
    """
    prompt = (
        f"Variance detected for course. Details:\n"
        f"Planned Sessions: {variance_data.get('planned_sessions', variance_data.get('planned_hours'))}\n"
        f"Actual Sessions: {variance_data.get('actual_sessions', variance_data.get('actual_hours'))}\n"
        f"Variance: {variance_data.get('variance_sessions', variance_data.get('variance_hours'))}\n"
        f"Available Buffer Sessions in affected unit: {variance_data.get('buffer_available', 0)}\n\n"
        "Provide a concise recommendation for replanning."
    )
    
    try:
        client = genai.Client()
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        error_str = str(e)
        if "503" in error_str or "429" in error_str:
            print("Gemini unavailable in Agent 6. Falling back to Groq...")
            try:
                from app.tools.groq_fallback import call_groq_api
                return call_groq_api(prompt, is_json=False).strip()
            except Exception as groq_e:
                print(f"Groq fallback also failed: {groq_e}")
                
        print(f"Agent 6 failed: {e}")
        # Fallback
        if variance_data.get('buffer_available', 0) > 0:
            return "Recommend using the available buffer session."
        return "Recommend adding a compensatory session."
