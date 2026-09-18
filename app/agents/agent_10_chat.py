import json
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.database.database import get_db
import app.models as models
from app.tools.groq_fallback import call_groq_api

class ChatAgent:
    """
    Agent 10 - Chat Agent
    Responsibilities: Handles free-form chat queries from the user using Groq,
    enriched with context from their timetable, classes, and lesson plans.
    """
    
    @staticmethod
    def handle_query(faculty_id: str, query: str, db: Session) -> str:
        # Fetch Faculty Info
        faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
        if not faculty:
            return "Error: Faculty not found."
        
        # Fetch Timetable Slots for this faculty
        slots = db.query(models.TimetableSlot).filter(models.TimetableSlot.faculty_id == faculty_id).all()
        
        # Fetch Courses for this faculty (via slots)
        course_ids = {slot.course_id for slot in slots}
        courses = db.query(models.Course).filter(models.Course.id.in_(course_ids)).all() if course_ids else []
        
        # Fetch Sections for this faculty (via slots)
        section_ids = {slot.section_id for slot in slots}
        sections = db.query(models.Section).filter(models.Section.id.in_(section_ids)).all() if section_ids else []
        
        # Fetch active lesson plans
        lesson_plans = db.query(models.LessonPlan).filter(
            models.LessonPlan.course_id.in_(course_ids),
            models.LessonPlan.section_id.in_(section_ids)
        ).all() if course_ids and section_ids else []
        
        lesson_plan_ids = {lp.id for lp in lesson_plans}
        
        # Fetch today's and upcoming sessions if available
        today = date.today()
        sessions = db.query(models.LessonSession).filter(
            models.LessonSession.lesson_plan_id.in_(lesson_plan_ids),
            models.LessonSession.date >= today
        ).order_by(models.LessonSession.date, models.LessonSession.period).limit(10).all() if lesson_plan_ids else []

        # Build context
        context_str = f"Current Date and Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        context_str += f"Faculty Name: {faculty.name}\n"
        context_str += f"Designation: {faculty.designation}\n\n"
        
        context_str += "--- COURSES TAUGHT ---\n"
        for c in courses:
            context_str += f"- {c.code}: {c.name}\n"
            
        context_str += "\n--- SECTIONS ---\n"
        for s in sections:
            context_str += f"- {s.name}\n"
            
        context_str += "\n--- WEEKLY TIMETABLE ---\n"
        for s in slots:
            course = next((c for c in courses if c.id == s.course_id), None)
            section = next((sec for sec in sections if sec.id == s.section_id), None)
            course_name = course.name if course else "Unknown"
            section_name = section.name if section else "Unknown"
            context_str += f"{s.day_of_week}, Period {s.period_number}: {course_name} (Section: {section_name})\n"
            
        context_str += "\n--- UPCOMING SCHEDULED CLASSES ---\n"
        for sess in sessions:
            context_str += f"Date: {sess.date}, Period: {sess.period}, Status: {sess.status}, Type: {sess.session_type}\n"
            
        prompt = f"""You are a helpful academic AI assistant for a faculty member. 
Use the following context about their schedule, courses, and upcoming classes to answer their query.
If the query asks something not covered in the context, you can answer it generally or state that you don't have that specific data.
Be concise, polite, and directly answer the question.

CONTEXT:
{context_str}

USER QUERY: {query}
"""
        
        # Use ONLY Groq as requested
        try:
            response = call_groq_api(prompt, is_json=False)
            return response
        except Exception as e:
            return f"Failed to get response from Groq API: {str(e)}"
