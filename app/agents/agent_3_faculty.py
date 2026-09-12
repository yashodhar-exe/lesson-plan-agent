from sqlalchemy.orm import Session

class FacultyAgent:
    """
    Agent 3 - Faculty & Workload Agent (Deterministic API Agent)
    Responsibilities: Track faculty assignments, availability, and teaching workload.
    """
    
    @staticmethod
    def check_faculty_availability(db: Session, faculty_id: str, target_date):
        """
        Check if faculty is available to teach on a given date (e.g. no leave requests).
        For the hackathon, we assume always available unless it's a Sunday.
        """
        if target_date.weekday() == 6:  # Sunday
            return False
        return True
    
    @staticmethod
    def get_faculty_workload(db: Session, faculty_id: str):
        return {
            "total_weekly_hours": 12,
            "assigned_courses": ["CS301"]
        }
