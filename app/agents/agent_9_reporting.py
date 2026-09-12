from sqlalchemy.orm import Session
from app import models

class ReportingAgent:
    """
    Agent 9 - Reporting / Accreditation Agent (Deterministic API Agent)
    Responsibilities: Generate structured reports comparing planned vs actuals for accreditation.
    """
    
    @staticmethod
    def generate_variance_report(db: Session, plan_id: str):
        plan = db.query(models.LessonPlan).filter(models.LessonPlan.id == plan_id).first()
        if not plan:
            return {"error": "Plan not found"}
            
        sessions = db.query(models.LessonSession).filter(models.LessonSession.lesson_plan_id == plan_id).all()
        
        total_planned_hours = sum(s.planned_hours for s in sessions if s.session_type == "TEACHING")
        total_actual_hours = sum(s.actual_hours for s in sessions if s.session_type == "TEACHING" and s.status == "COMPLETED")
        
        return {
            "course": plan.course.name,
            "section": plan.section.name,
            "total_planned_teaching_hours": total_planned_hours,
            "total_actual_teaching_hours": total_actual_hours,
            "variance": total_actual_hours - total_planned_hours,
            "status": "ON TRACK" if total_actual_hours <= total_planned_hours else "BEHIND SCHEDULE"
        }
