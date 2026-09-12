from sqlalchemy.orm import Session
from app import models

class SyllabusAgent:
    """
    Agent 2 - Course / Syllabus Agent (Deterministic API Agent)
    Responsibilities: Extract and manage course information, units, topics, subtopics, and Course Outcomes.
    """
    
    @staticmethod
    def get_course_structure(db: Session, course_id: str):
        course = db.query(models.Course).filter(models.Course.id == course_id).first()
        if not course:
            return {}

        structure = {
            "course_code": course.code,
            "course_name": course.name,
            "total_notional_hours": course.notional_hours, # Fixed
            "units": [],
            "course_outcomes": [{"code": "CO1", "description": "Understand fundamentals"}] # Mocked for demo
        }

        for unit in sorted(course.units, key=lambda x: x.unit_number):
            unit_data = {
                "unit_number": unit.unit_number,
                "name": unit.name,
                "notional_hours": unit.notional_hours,
                "topics": []
            }
            for topic in sorted(unit.topics, key=lambda x: x.order):
                unit_data["topics"].append({
                    "name": topic.name
                })
            structure["units"].append(unit_data)

        return structure
