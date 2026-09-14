from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
import shutil
import os

from app.database.database import engine, Base, get_db
from app.schemas import (
    LessonPlanSchema, VarianceReportSchema, CalendarEventSchema, TimetableSlotSchema
)
from app.tools.planning_engine import (
    get_available_teaching_slots, 
    allocate_topics_to_sessions,
    calculate_faculty_load
)
from app.tools.validation_tools import validate_lesson_plan

# Import All 9 Agents
from app.agents.agent_1_academic import AcademicMasterAgent
from app.agents.agent_2_syllabus import SyllabusAgent
from app.agents.agent_3_faculty import FacultyAgent
from app.agents.agent_4_timetable import TimetableAgent
from app.agents.agent_5_lesson_plan import get_agent_5, enrich_lesson_plan
from app.agents.agent_6_variance import get_agent_6, generate_replanning_recommendation
from app.agents.agent_7_assessment import AssessmentAgent
from app.agents.agent_8_rag import RAGAgent
from app.agents.agent_9_reporting import ReportingAgent

import app.models as models

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Lesson Plan Agent API",
    description="Agentic Backend for Academic Hackathon (Agent 5 & 6)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's a local hackathon project, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Lesson Plan Agent API is running"}

@app.post("/api/calendar/import")
def import_calendar(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Using Gemini Parser for Calendar
    from app.tools.gemini_parser import parse_calendar_with_gemini
    
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        events_data = parse_calendar_with_gemini(temp_path, file.content_type)
        # Assuming we just attach to the first semester for demo
        semester = db.query(models.Semester).first()
        inserted = 0
        for event in events_data:
            if event.get("event_type") in [e.value for e in models.EventType]:
                db_event = models.CalendarEvent(
                    semester_id=semester.id,
                    date=date.fromisoformat(event["date"]),
                    event_type=event["event_type"],
                    description=event.get("description", "")
                )
                db.add(db_event)
                inserted += 1
        db.commit()
        return {"status": "success", "message": f"Calendar imported: {inserted} events"}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/api/calendar/{semester_id}", response_model=List[CalendarEventSchema])
def get_calendar(semester_id: str, db: Session = Depends(get_db)):
    events = db.query(models.CalendarEvent).filter(models.CalendarEvent.semester_id == semester_id).all()
    return events

@app.post("/api/timetables/import")
def import_timetable(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        inserted = TimetableAgent.import_timetable(db, temp_path, file.content_type)
        return {"status": "success", "message": f"Timetable imported. {inserted} slots created."}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

class FacultySync(BaseModel):
    id: str
    email: str
    name: str

@app.post("/api/faculty/sync")
def sync_faculty(faculty_data: FacultySync, db: Session = Depends(get_db)):
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_data.id).first()
    if not faculty:
        faculty = models.Faculty(id=faculty_data.id, email=faculty_data.email, name=faculty_data.name)
        db.add(faculty)
    else:
        faculty.email = faculty_data.email
        faculty.name = faculty_data.name
    db.commit()
    db.refresh(faculty)
    return {"id": faculty.id, "name": faculty.name, "email": faculty.email}

@app.get("/api/faculty/{faculty_id}")
def get_faculty(faculty_id: str, db: Session = Depends(get_db)):
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return {"id": faculty.id, "name": faculty.name, "email": faculty.email}

@app.get("/api/faculty/{faculty_id}/sections")
def get_faculty_sections(faculty_id: str, db: Session = Depends(get_db)):
    # Distinct sections taught by this faculty
    slots = db.query(models.TimetableSlot).filter(models.TimetableSlot.faculty_id == faculty_id).all()
    section_ids = list(set(s.section_id for s in slots))
    sections = db.query(models.Section).filter(models.Section.id.in_(section_ids)).all()
    return [{"id": s.id, "name": s.name} for s in sections]

@app.get("/api/faculty/{faculty_id}/workload")
def get_faculty_workload(faculty_id: str, db: Session = Depends(get_db)):
    slots = db.query(models.TimetableSlot).filter(models.TimetableSlot.faculty_id == faculty_id).all()
    
    assignments = {}
    for slot in slots:
        key = (slot.course_id, slot.section_id)
        assignments[key] = assignments.get(key, 0) + 1
        
    section_reports = []
    for (cid, sid), count in assignments.items():
        course = db.query(models.Course).filter(models.Course.id == cid).first()
        section = db.query(models.Section).filter(models.Section.id == sid).first()
        semester = db.query(models.Semester).filter(models.Semester.id == section.semester_id).first() if section else None
        
        plan = db.query(models.LessonPlan).filter(models.LessonPlan.course_id == cid, models.LessonPlan.section_id == sid).first()
        target_sessions = 0
        completed_sessions = 0
        if plan:
            sessions = db.query(models.LessonSession).filter(models.LessonSession.lesson_plan_id == plan.id).all()
            target_sessions = len(sessions)
            completed_sessions = len([s for s in sessions if s.status == "COMPLETED"])
            
        section_reports.append({
            "course_id": cid,
            "section_id": sid,
            "course_name": course.name if course else "Unknown",
            "section_name": section.name if section else "Unknown",
            "academic_year": semester.name if semester else "2026-27",
            "target_sessions": target_sessions,
            "completed_sessions": completed_sessions
        })
        
    next_class = None
    for slot in slots:
        if next_class: break
        plan = db.query(models.LessonPlan).filter(models.LessonPlan.course_id == slot.course_id, models.LessonPlan.section_id == slot.section_id).first()
        if plan:
            session = db.query(models.LessonSession).filter(models.LessonSession.lesson_plan_id == plan.id, models.LessonSession.status == "PLANNED").order_by(models.LessonSession.session_number).first()
            if session:
                course = db.query(models.Course).filter(models.Course.id == slot.course_id).first()
                section = db.query(models.Section).filter(models.Section.id == slot.section_id).first()
                topic_name = "Buffer Session"
                if session.topic_id:
                    topic = db.query(models.Topic).filter(models.Topic.id == session.topic_id).first()
                    if topic: topic_name = topic.name
                next_class = {
                    "course_name": course.name if course else "",
                    "section_name": section.name if section else "",
                    "topic_name": topic_name,
                    "teaching_method": session.teaching_method,
                    "date": session.date.isoformat() if session.date else None,
                    "period": session.period
                }

    return {
        "total_periods_per_week": len(slots),
        "sections": section_reports,
        "next_class": next_class
    }

@app.get("/api/faculty/{faculty_id}/courses")
def get_faculty_courses(faculty_id: str, db: Session = Depends(get_db)):
    slots = db.query(models.TimetableSlot).filter(models.TimetableSlot.faculty_id == faculty_id).all()
    course_ids = list(set(s.course_id for s in slots))
    courses = db.query(models.Course).filter(models.Course.id.in_(course_ids)).all()
    return [{"id": c.id, "name": c.name, "code": c.code} for c in courses]

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    return [{"id": c.id, "name": c.name, "code": c.code} for c in courses]

@app.get("/api/courses/{course_id}/sections")
def get_course_sections(course_id: str, db: Session = Depends(get_db)):
    plans = db.query(models.LessonPlan).filter(models.LessonPlan.course_id == course_id).all()
    section_ids = [p.section_id for p in plans]
    sections = db.query(models.Section).filter(models.Section.id.in_(section_ids)).all()
    return [{"id": s.id, "name": s.name} for s in sections]

@app.get("/api/lesson-plans/search")
def search_lesson_plan(course_id: str, section_id: str, db: Session = Depends(get_db)):
    plan = db.query(models.LessonPlan).filter(
        models.LessonPlan.course_id == course_id,
        models.LessonPlan.section_id == section_id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    sessions = db.query(models.LessonSession).filter(models.LessonSession.lesson_plan_id == plan.id).order_by(models.LessonSession.session_number).all()
    
    session_list = []
    for s in sessions:
        topic_name = "Buffer Session"
        if s.topic_id:
            topic = db.query(models.Topic).filter(models.Topic.id == s.topic_id).first()
            if topic:
                topic_name = topic.name
        
        session_list.append({
            "id": s.id,
            "session_number": s.session_number,
            "date": str(s.date) if s.date else None,
            "period": s.period,
            "unit_id": s.unit_id,
            "topic_id": s.topic_id,
            "topic_name": topic_name,
            "course_outcomes": s.course_outcomes,
            "teaching_method": s.teaching_method,
            "session_type": s.session_type,
            "status": s.status
        })
        
    return {
        "id": plan.id,
        "course_id": plan.course_id,
        "section_id": plan.section_id,
        "status": plan.status,
        "sessions": session_list
    }

@app.post("/api/lesson-plans/generate")
def generate_lesson_plan(course_id: str, section_id: str, semester_id: str, db: Session = Depends(get_db)):
    """
    Agent 5 core workflow to generate a draft lesson plan.
    """
    # 1. Fetch academic context via Upstream Agents
    academic_context = AcademicMasterAgent.get_academic_context(db, course_id, section_id, semester_id)
    if not academic_context["course_name"] or not academic_context["semester"]:
        raise HTTPException(status_code=404, detail="Course, Section, or Semester not found")

    course_structure = SyllabusAgent.get_course_structure(db, course_id)
    units = db.query(models.Unit).filter(models.Unit.course_id == course_id).all() # needed for deterministic engine
    
    timetable_slots_raw = TimetableAgent.get_teaching_slots(db, section_id, course_id)
    # reconstruct objects for the planning engine
    timetable_slots = db.query(models.TimetableSlot).filter(
        models.TimetableSlot.course_id == course_id,
        models.TimetableSlot.section_id == section_id
    ).all()
    
    calendar_events = db.query(models.CalendarEvent).filter(models.CalendarEvent.semester_id == semester_id).all()
    # also use agent 7 for assessment checking later
    mid_terms = AssessmentAgent.get_assessment_schedule(db, semester_id)

    if not timetable_slots:
        raise HTTPException(status_code=400, detail="No timetable slots found for this course and section")

    # 2. Deterministic Planning
    semester_obj = db.query(models.Semester).filter(models.Semester.id == semester_id).first()
    try:
        available_sessions = get_available_teaching_slots(
            semester_obj.start_date, semester_obj.end_date, timetable_slots, calendar_events
        )
        draft_sessions = allocate_topics_to_sessions(available_sessions, units, buffers_per_unit=1)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Validation
    is_valid, errors = validate_lesson_plan(draft_sessions, calendar_events, units, course_structure.get("total_notional_hours", 45))
    if not is_valid:
        raise HTTPException(status_code=400, detail={"message": "Validation failed", "errors": errors})

    # 4. LLM Enrichment (Agent 5 & Agent 8)
    agent = get_agent_5()
    
    # Retrieve outcomes from SyllabusAgent
    co_list = course_structure.get("course_outcomes", [])
    
    # For hackathon, Agent 8 generates reference materials for the first topic just to show integration
    first_topic = draft_sessions[0]["topic_name"] if draft_sessions else "Database Systems"
    reference_materials = RAGAgent.get_reference_materials(first_topic)
    
    enriched_sessions = enrich_lesson_plan(agent, draft_sessions, co_list, reference_materials)

    # 5. Save Draft to DB
    new_plan = models.LessonPlan(
        course_id=course_id,
        section_id=section_id,
        semester_id=semester_id,
        status=models.PlanStatus.DRAFT,
        version=1
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    
    for sess in enriched_sessions:
        # Ensure date is a Python date object
        session_date = sess["date"]
        if isinstance(session_date, str):
            session_date = date.fromisoformat(session_date[:10])

        db_sess = models.LessonSession(
            lesson_plan_id=new_plan.id,
            session_number=sess["session_number"],
            date=session_date,
            period=sess["period"],
            unit_id=sess.get("unit_id"),
            topic_id=sess.get("topic_id"),
            course_outcomes=sess.get("course_outcomes", []),
            teaching_method=sess.get("teaching_method"),
            planned_hours=sess.get("planned_hours", 1.0),
            session_type=sess.get("session_type", "TEACHING"),
            status=sess.get("status", "PLANNED")
        )
        db.add(db_sess)
    
    db.commit()
    
    return {"status": "success", "message": "Draft plan generated", "plan_id": new_plan.id}

@app.post("/api/lesson-plans/{plan_id}/approve")
def approve_lesson_plan(plan_id: str, db: Session = Depends(get_db)):
    plan = db.query(models.LessonPlan).filter(models.LessonPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    plan.status = models.PlanStatus.APPROVED
    db.commit()
    return {"status": "success", "message": "Plan approved"}

@app.post("/api/lesson-plans/{plan_id}/publish")
def publish_lesson_plan(plan_id: str, db: Session = Depends(get_db)):
    plan = db.query(models.LessonPlan).filter(models.LessonPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    plan.status = models.PlanStatus.PUBLISHED
    db.commit()
    
    # In full system, this would emit an event: LESSON_PLAN_PUBLISHED
    return {"status": "success", "message": "Plan published"}

@app.post("/api/lesson-sessions/{session_id}/progress")
def update_progress(session_id: str, status: str, actual_hours: float, db: Session = Depends(get_db)):
    session = db.query(models.LessonSession).filter(models.LessonSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session.status = status
    session.actual_hours = actual_hours
    db.commit()
    return {"status": "success", "message": "Progress updated"}

@app.get("/api/lesson-plans/{plan_id}/variance")
def get_variance_report(plan_id: str, db: Session = Depends(get_db)):
    plan = db.query(models.LessonPlan).filter(models.LessonPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Use Agent 9 for basic metrics
    report_metrics = ReportingAgent.generate_variance_report(db, plan.id)
    if "error" in report_metrics:
        raise HTTPException(status_code=404, detail=report_metrics["error"])
        
    variance_hours = report_metrics["variance"]
    variance_detected = variance_hours > 0

    if variance_detected:
        # Agent 6 handles complex replanning recommendations
        agent = get_agent_6()
        
        # We need to know available buffers (this could also be fetched via an agent, but keep it simple here)
        sessions = db.query(models.LessonSession).filter(models.LessonSession.lesson_plan_id == plan_id).all()
        buffer_available = sum(1 for s in sessions if s.session_type == "BUFFER" and s.status == "AVAILABLE")
        
        variance_data = {
            "planned_hours": report_metrics["total_planned_teaching_hours"],
            "actual_hours": report_metrics["total_actual_teaching_hours"],
            "variance_hours": variance_hours,
            "buffer_available": buffer_available
        }
        recommendation = generate_replanning_recommendation(agent, variance_data)
    else:
        recommendation = "On track. No replanning necessary."

    return {
        "plan_id": plan_id,
        "variance_detected": variance_detected,
        "variance_hours": variance_hours,
        "recommendation": recommendation
    }

@app.get("/api/reports/plan-vs-actual/{course_id}")
def get_plan_vs_actual(course_id: str, db: Session = Depends(get_db)):
    """
    Returns metrics comparing planned vs actual hours for a course.
    """
    plans = db.query(models.LessonPlan).filter(models.LessonPlan.course_id == course_id).all()
    if not plans:
        raise HTTPException(status_code=404, detail="No plans found for course")
        
    # Aggregate data across all sections (plans) for this course
    total_planned = 0
    total_actual = 0
    for plan in plans:
        metrics = ReportingAgent.generate_variance_report(db, plan.id)
        if "error" not in metrics:
            total_planned += metrics["total_planned_teaching_hours"]
            total_actual += metrics["total_actual_teaching_hours"]
            
    return {
        "course_id": course_id,
        "total_planned_hours": total_planned,
        "total_actual_hours": total_actual,
        "variance": total_planned - total_actual
    }

@app.get("/api/reports/course-delivery/{course_id}")
def get_course_delivery_status(course_id: str, db: Session = Depends(get_db)):
    """
    Returns high-level delivery status across sections.
    """
    plans = db.query(models.LessonPlan).filter(models.LessonPlan.course_id == course_id).all()
    if not plans:
        raise HTTPException(status_code=404, detail="No plans found for course")
        
    section_reports = []
    for plan in plans:
        section = db.query(models.Section).filter(models.Section.id == plan.section_id).first()
        metrics = ReportingAgent.generate_variance_report(db, plan.id)
        status = "On Track"
        if "error" not in metrics and metrics["variance"] > 0:
            status = "Lagging"
        elif "error" not in metrics and metrics["variance"] < 0:
            status = "Ahead"
            
        section_reports.append({
            "section_name": section.name if section else "Unknown",
            "status": status,
            "variance_hours": metrics.get("variance", 0) if "error" not in metrics else 0
        })
        
    return {
        "course_id": course_id,
        "sections": section_reports
    }

from fastapi import Form
import json

@app.post("/api/setup-course")
def setup_course(
    course_name: str = Form(...),
    course_code: str = Form(...),
    academic_year: str = Form(...),
    semester_cycle: str = Form(...),
    department: str = Form(...),
    instructor: str = Form(...),
    sections: str = Form(...), # JSON string of section names
    faculty_id: str = Form(...),
    calendar_file: UploadFile = File(...),
    timetable_file: UploadFile = File(...),
    syllabus_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    from app.tools.gemini_parser import parse_calendar_with_gemini, parse_syllabus_with_gemini
    
    # We create or find the objects in the DB (Course, Faculty, Semester, Sections, etc.)
    # For hackathon simplicity, we might just associate with existing seed data or create new.
    
    # 1. Create or get Course
    course = db.query(models.Course).filter(models.Course.code == course_code).first()
    if not course:
        course = models.Course(id=course_code, name=course_name, code=course_code, notional_hours=45.0)
        db.add(course)
        db.commit()
        db.refresh(course)
    
    # 2. Get active faculty
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        faculty = models.Faculty(id=faculty_id, name=instructor, email="faculty@vignan.edu")
        db.add(faculty)
        db.commit()
        
    # 3. Create or get Semester
    semester_id = academic_year + "-" + semester_cycle.split(" ")[0]
    semester = db.query(models.Semester).filter(models.Semester.id == semester_id).first()
    if not semester:
        # Defaults for start/end
        semester = models.Semester(id=semester_id, name=f"{academic_year} {semester_cycle}", start_date=date(2026, 7, 1), end_date=date(2026, 12, 15))
        db.add(semester)
        db.commit()
    
    # 4. Handle Sections
    sec_names = json.loads(sections)
    section_ids = []
    for s_name in sec_names:
        sec = db.query(models.Section).filter(models.Section.name == s_name).first()
        if not sec:
            sec_id = s_name.replace(" ", "-")
            sec = models.Section(id=sec_id, name=s_name, semester_id=semester.id)
            db.add(sec)
            db.commit()
        section_ids.append(sec.id)
        
    # 5. Process Files
    # Timetable
    tt_temp = f"temp_tt_{timetable_file.filename}"
    with open(tt_temp, "wb") as buffer:
        shutil.copyfileobj(timetable_file.file, buffer)
    try:
        # Clear existing timetable slots for this course to prevent duplicates
        db.query(models.TimetableSlot).filter(models.TimetableSlot.course_id == course.id).delete()
        db.commit()
        TimetableAgent.import_timetable(db, tt_temp, timetable_file.content_type, default_course_id=course.id, default_faculty_id=faculty_id)
    finally:
        if os.path.exists(tt_temp):
            os.remove(tt_temp)
            
    # Calendar
    cal_temp = f"temp_cal_{calendar_file.filename}"
    with open(cal_temp, "wb") as buffer:
        shutil.copyfileobj(calendar_file.file, buffer)
    try:
        # Clear existing calendar events for this semester to prevent duplicates
        db.query(models.CalendarEvent).filter(models.CalendarEvent.semester_id == semester.id).delete()
        db.commit()

        events_data = parse_calendar_with_gemini(cal_temp, calendar_file.content_type)
        for event in events_data:
            if event.get("event_type") in [e.value for e in models.EventType]:
                db_event = models.CalendarEvent(
                    semester_id=semester.id,
                    date=date.fromisoformat(event["date"]),
                    event_type=event["event_type"],
                    description=event.get("description", "")
                )
                db.add(db_event)
        db.commit()
    finally:
        if os.path.exists(cal_temp):
            os.remove(cal_temp)
            
    # Syllabus
    syl_temp = f"temp_syl_{syllabus_file.filename}"
    with open(syl_temp, "wb") as buffer:
        shutil.copyfileobj(syllabus_file.file, buffer)
    try:
        # Clear existing topics and units explicitly
        old_units = db.query(models.Unit).filter(models.Unit.course_id == course.id).all()
        for u in old_units:
            db.query(models.Topic).filter(models.Topic.unit_id == u.id).delete()
        db.query(models.Unit).filter(models.Unit.course_id == course.id).delete()
        db.commit()
        
        units_data = parse_syllabus_with_gemini(syl_temp, syllabus_file.content_type)
        for u_data in units_data:
            db_unit = models.Unit(
                course_id=course.id,
                unit_number=u_data.get("unit_number", 1),
                name=u_data.get("name", "Unknown Unit"),
                notional_hours=u_data.get("notional_hours", 8)
            )
            db.add(db_unit)
            db.commit()
            db.refresh(db_unit)
            
            for t_idx, topic_name in enumerate(u_data.get("topics", [])):
                db_topic = models.Topic(
                    unit_id=db_unit.id,
                    order=t_idx + 1,
                    name=topic_name
                )
                db.add(db_topic)
            db.commit()
    finally:
        if os.path.exists(syl_temp):
            os.remove(syl_temp)
            
    # 6. Finally generate lesson plans for each section!
    plans = []
    for sec_id in section_ids:
        # Clear any existing plans for this course and section to prevent clutter
        db.query(models.LessonPlan).filter(models.LessonPlan.course_id == course.id, models.LessonPlan.section_id == sec_id).delete()
        db.commit()
        
        # Trigger the generation
        try:
            res = generate_lesson_plan(course.id, sec_id, semester.id, db)
            plans.append(res)
        except Exception as e:
            print(f"Failed to generate plan for {sec_id}: {e}")

    return {"status": "success", "message": "Course configured and lesson plans generated.", "plans": plans}
