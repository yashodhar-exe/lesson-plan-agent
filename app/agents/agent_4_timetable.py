from sqlalchemy.orm import Session
from app import models
import re
from app.tools.gemini_parser import parse_timetable_with_gemini

class TimetableAgent:
    """
    Agent 4 - Timetable Agent (Deterministic API Agent)
    Responsibilities: Provide available course-specific teaching slots to Agent 5.
    And import timetables from raw documents using Gemini OCR.
    """
    
    @staticmethod
    def get_teaching_slots(db: Session, section_id: str, course_id: str):
        slots = db.query(models.TimetableSlot).filter(
            models.TimetableSlot.section_id == section_id,
            models.TimetableSlot.course_id == course_id
        ).all()
        
        # Mapping from integer 0-6 to day name or just returning as is
        return [
            {"day_of_week": slot.day_of_week, "period_number": slot.period_number}
            for slot in slots
        ]

    @staticmethod
    def import_timetable(db: Session, file_path: str, mime_type: str = "application/pdf", default_course_id: str = None):
        """
        Parses a timetable file using Gemini and inserts/updates slots in the database.
        """
        slots_data = parse_timetable_with_gemini(file_path, mime_type)
        
        inserted_slots = []
        for slot in slots_data:
            section_name = slot.get("section")
            course_name = slot.get("course_name")
            faculty_name = slot.get("faculty_name")
            
            # Try to resolve IDs (in a real system we'd use fuzzy matching or exact codes)
            section = db.query(models.Section).filter(models.Section.name == section_name).first()
            if not section and section_name:
                # Try fuzzy matching, e.g., if timetable says "C", it matches "CSE-C"
                section = db.query(models.Section).filter(models.Section.name.endswith(section_name)).first()
            
            # Smart fallback: match numeric parts (e.g. "SECTION-8" in PDF -> "CSE-8" in DB)
            if not section and section_name:
                pdf_nums = re.findall(r'\d+', section_name)
                if pdf_nums:
                    pdf_num = pdf_nums[0] # taking the first number like '8' from 'SECTION-8 [N-415]'
                    for db_sec in db.query(models.Section).all():
                        db_nums = re.findall(r'\d+', db_sec.name)
                        if db_nums and db_nums[0] == pdf_num:
                            section = db_sec
                            break
            
            course = None
            if default_course_id and course_name:
                # Prioritize the course currently being setup
                def_course = db.query(models.Course).filter(models.Course.id == default_course_id).first()
                if def_course and (course_name.lower() in def_course.name.lower() or course_name == def_course.code):
                    course = def_course
                    
            if not course and course_name:
                course = db.query(models.Course).filter(models.Course.name.ilike(f"%{course_name}%") | (models.Course.code == course_name)).first()
            
            # Note: We purposely DO NOT blindly fallback to default_course_id for unmatched courses 
            # to prevent polluting the schedule with other subjects like Physics, Math etc.
                
            faculty_id = None
            if faculty_name:
                faculty = db.query(models.Faculty).filter(models.Faculty.name.ilike(f"%{faculty_name}%")).first()
                if faculty:
                    faculty_id = faculty.id

            if section and course:
                new_slot = models.TimetableSlot(
                    section_id=section.id,
                    course_id=course.id,
                    faculty_id=faculty_id,
                    day_of_week=slot.get("day_of_week"),
                    period_number=slot.get("period_number")
                )
                db.add(new_slot)
                inserted_slots.append(new_slot)
                
        db.commit()
        return len(inserted_slots)
