from sqlalchemy.orm import Session
from app import models

class AcademicMasterAgent:
    """
    Agent 1 - Academic Master Data Agent (Deterministic API Agent)
    Responsibilities: Manage institution, academic year, semester, and normalized academic data.
    """
    
    @staticmethod
    def get_academic_context(db: Session, course_id: str, section_id: str, semester_id: str):
        """
        Exposes normalized academic data to downstream agents.
        """
        course = db.query(models.Course).filter(models.Course.id == course_id).first()
        section = db.query(models.Section).filter(models.Section.id == section_id).first()
        semester = db.query(models.Semester).filter(models.Semester.id == semester_id).first()
        
        return {
            "academic_year": "2026-27",  # Mocked year for the hackathon
            "semester": semester.name if semester else None,
            "semester_start": semester.start_date.isoformat() if semester else None,
            "semester_end": semester.end_date.isoformat() if semester else None,
            "course_name": course.name if course else None,
            "course_code": course.code if course else None,
            "section": section.name if section else None
        }

    @staticmethod
    def get_holidays(db: Session, semester_id: str):
        events = db.query(models.CalendarEvent).filter(
            models.CalendarEvent.semester_id == semester_id,
            models.CalendarEvent.event_type == models.EventType.HOLIDAY
        ).all()
        return [e.date for e in events]
