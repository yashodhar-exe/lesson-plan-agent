from sqlalchemy.orm import Session
from app import models

class AssessmentAgent:
    """
    Agent 7 - Assessment / Examination Agent (Deterministic API Agent)
    Responsibilities: Provide schedules and cut-offs for internal/mid-term exams.
    """
    
    @staticmethod
    def get_assessment_schedule(db: Session, semester_id: str):
        events = db.query(models.CalendarEvent).filter(
            models.CalendarEvent.semester_id == semester_id,
            models.CalendarEvent.event_type == models.EventType.MIDTERM_EXAM
        ).all()
        return [
            {
                "date": e.date.isoformat(),
                "description": e.description
            }
            for e in events
        ]
