import os
import json
from google import genai

def get_agent_5():
    # Returns a dummy object or configuration if needed
    return {"name": "lesson_plan_agent"}

def enrich_lesson_plan(agent, draft_plan, course_outcomes, reference_materials):
    """
    Calls Agent 5 to enrich the draft plan.
    """
    prompt = (
        f"Here is the draft lesson plan: {json.dumps(draft_plan, default=str)}\n"
        f"Available Course Outcomes: {json.dumps(course_outcomes, default=str)}\n"
        f"Available Reference Materials: {json.dumps(reference_materials, default=str)}\n"
        "Please return the updated lesson plan in JSON format with 'teaching_method' and 'course_outcomes' mapped for each session."
    )
    
    try:
        client = genai.Client()
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        content = response.text
        import re
        json_match = re.search(r'```json\n(.*?)```', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        return json.loads(content)
    except Exception as e:
        print(f"LLM Enrichment failed: {e}")
        for session in draft_plan:
            if session.get("session_type") == "TEACHING":
                session["teaching_method"] = "LECTURE"
                session["course_outcomes"] = ["CO1"]
        return draft_plan
