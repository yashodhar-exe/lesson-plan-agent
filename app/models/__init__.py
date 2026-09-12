from sqlalchemy import Column, String, Integer, Date, ForeignKey, Enum as SqlEnum, Boolean, Float, Text, JSON
from sqlalchemy.orm import relationship
import enum
import uuid
from datetime import datetime
from app.database.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)

class AcademicYear(Base):
    __tablename__ = "academic_years"
    id = Column(String, primary_key=True, default=generate_uuid)
    institution_id = Column(String, ForeignKey("institutions.id"))
    name = Column(String, nullable=False) # e.g. "2026-27"
    start_date = Column(Date)
    end_date = Column(Date)

class Semester(Base):
    __tablename__ = "semesters"
    id = Column(String, primary_key=True, default=generate_uuid)
    academic_year_id = Column(String, ForeignKey("academic_years.id"))
    name = Column(String, nullable=False) # e.g. "Semester-I"
    start_date = Column(Date)
    end_date = Column(Date)

class Department(Base):
    __tablename__ = "departments"
    id = Column(String, primary_key=True, default=generate_uuid)
    institution_id = Column(String, ForeignKey("institutions.id"))
    name = Column(String, nullable=False) # e.g. "CSE"
    
class Program(Base):
    __tablename__ = "programs"
    id = Column(String, primary_key=True, default=generate_uuid)
    department_id = Column(String, ForeignKey("departments.id"))
    name = Column(String, nullable=False) # e.g. "B.Tech CSE"

class Section(Base):
    __tablename__ = "sections"
    id = Column(String, primary_key=True, default=generate_uuid)
    program_id = Column(String, ForeignKey("programs.id"))
    semester_id = Column(String, ForeignKey("semesters.id"))
    name = Column(String, nullable=False) # e.g. "CSE-A"

class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(String, primary_key=True, default=generate_uuid)
    department_id = Column(String, ForeignKey("departments.id"))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, default=generate_uuid)
    department_id = Column(String, ForeignKey("departments.id"))
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    notional_hours = Column(Float, nullable=False)
    units = relationship("Unit", backref="course")
    outcomes = relationship("CourseOutcome", backref="course")

class CourseOutcome(Base):
    __tablename__ = "course_outcomes"
    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id"))
    code = Column(String, nullable=False) # e.g. "CO1"
    description = Column(Text, nullable=False)

class Unit(Base):
    __tablename__ = "units"
    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id"))
    unit_number = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    notional_hours = Column(Float, nullable=False)
    topics = relationship("Topic", backref="unit")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(String, primary_key=True, default=generate_uuid)
    unit_id = Column(String, ForeignKey("units.id"))
    name = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    is_optional = Column(Boolean, default=False)
    # comma separated co ids or many-to-many. For simplicity, just storing as JSON list of CO codes or ids
    mapped_co_codes = Column(JSON, default=list)

class EventType(str, enum.Enum):
    TEACHING_DAY = "TEACHING_DAY"
    HOLIDAY = "HOLIDAY"
    INSTITUTIONAL_EVENT = "INSTITUTIONAL_EVENT"
    MIDTERM_EXAM = "MIDTERM_EXAM"
    INTERNAL_ASSESSMENT = "INTERNAL_ASSESSMENT"
    FORMATIVE_ASSESSMENT = "FORMATIVE_ASSESSMENT"
    SUMMATIVE_ASSESSMENT = "SUMMATIVE_ASSESSMENT"
    PREPARATION_PERIOD = "PREPARATION_PERIOD"
    SEMESTER_START = "SEMESTER_START"
    SEMESTER_END = "SEMESTER_END"
    MODULE_START = "MODULE_START"
    MODULE_END = "MODULE_END"
    UNKNOWN = "UNKNOWN"

class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    id = Column(String, primary_key=True, default=generate_uuid)
    semester_id = Column(String, ForeignKey("semesters.id"))
    date = Column(Date, nullable=False)
    event_type = Column(SqlEnum(EventType), nullable=False)
    description = Column(String)

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id = Column(String, primary_key=True, default=generate_uuid)
    section_id = Column(String, ForeignKey("sections.id"))
    course_id = Column(String, ForeignKey("courses.id"))
    faculty_id = Column(String, ForeignKey("faculty.id"))
    day_of_week = Column(String, nullable=False) # e.g. "Monday"
    period_number = Column(Integer, nullable=False)

class PlanStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    REVIEW = "REVIEW"
    APPROVED = "APPROVED"
    PUBLISHED = "PUBLISHED"
    SUPERSEDED = "SUPERSEDED"

class LessonPlan(Base):
    __tablename__ = "lesson_plans"
    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id"))
    section_id = Column(String, ForeignKey("sections.id"))
    semester_id = Column(String, ForeignKey("semesters.id"))
    version = Column(Integer, default=1)
    status = Column(SqlEnum(PlanStatus), default=PlanStatus.DRAFT)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    
    course = relationship("Course", backref="lesson_plans")
    section = relationship("Section", backref="lesson_plans")
    semester = relationship("Semester", backref="lesson_plans")

class SessionType(str, enum.Enum):
    TEACHING = "TEACHING"
    BUFFER = "BUFFER"

class SessionStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    COMPLETED = "COMPLETED"
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED"
    MISSED = "MISSED"
    CANCELLED = "CANCELLED"
    AVAILABLE = "AVAILABLE" # For unused buffers
    USED = "USED" # For used buffers

class LessonSession(Base):
    __tablename__ = "lesson_sessions"
    id = Column(String, primary_key=True, default=generate_uuid)
    lesson_plan_id = Column(String, ForeignKey("lesson_plans.id"))
    session_number = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    period = Column(Integer, nullable=False)
    unit_id = Column(String, ForeignKey("units.id"), nullable=True)
    topic_id = Column(String, ForeignKey("topics.id"), nullable=True)
    course_outcomes = Column(JSON, default=list) # List of CO codes
    teaching_method = Column(String, nullable=True)
    planned_hours = Column(Float, default=1.0)
    actual_hours = Column(Float, nullable=True)
    session_type = Column(SqlEnum(SessionType), default=SessionType.TEACHING)
    status = Column(SqlEnum(SessionStatus), default=SessionStatus.PLANNED)
    faculty_remarks = Column(Text, nullable=True)
    completion_timestamp = Column(String, nullable=True)

class VarianceReport(Base):
    __tablename__ = "variance_reports"
    id = Column(String, primary_key=True, default=generate_uuid)
    lesson_plan_id = Column(String, ForeignKey("lesson_plans.id"))
    planned_sessions = Column(Integer)
    actual_sessions = Column(Integer)
    variance_sessions = Column(Integer)
    affected_unit_id = Column(String, ForeignKey("units.id"), nullable=True)
    buffer_available = Column(Integer, default=0)
    recommendation = Column(Text)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class LearningResource(Base):
    __tablename__ = "learning_resources"
    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    resource_type = Column(String) # BOOK, PDF, URL
    url_or_path = Column(String)
