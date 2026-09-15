from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class CourseOutcomeSchema(BaseModel):
    id: str
    code: str
    description: str

class TopicSchema(BaseModel):
    id: str
    name: str
    order: int
    is_optional: bool
    mapped_co_codes: List[str]

class UnitSchema(BaseModel):
    id: str
    unit_number: int
    name: str
    notional_hours: float
    topics: List[TopicSchema]

class CourseSchema(BaseModel):
    id: str
    code: str
    name: str
    notional_hours: float
    units: List[UnitSchema]
    outcomes: List[CourseOutcomeSchema]

class CalendarEventSchema(BaseModel):
    date: date
    event_type: str
    description: Optional[str] = None

class TimetableSlotSchema(BaseModel):
    id: str
    day_of_week: str
    period_number: int

class LessonSessionSchema(BaseModel):
    session_number: int
    date: date
    period: int
    unit_id: Optional[str]
    topic_id: Optional[str]
    course_outcomes: List[str]
    teaching_method: Optional[str]
    planned_hours: float
    session_type: str
    status: str

class LessonPlanSchema(BaseModel):
    course_id: str
    section_id: str
    version: int
    status: str
    sessions: List[LessonSessionSchema]

class SessionUpdateSchema(BaseModel):
    status: str
    remarks: Optional[str] = None

class VarianceReportSchema(BaseModel):
    lesson_plan_id: str
    planned_sessions: int
    actual_sessions: int
    variance_sessions: int
    affected_unit_id: Optional[str]
    buffer_available: int
    recommendation: Optional[str]

class FacultyUpdateSchema(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    academic_affiliation: Optional[str] = None
    default_academic_term: Optional[str] = None
    lesson_plan_granularity: Optional[str] = None
    buffer_classes_allowance: Optional[int] = None
    auto_replanning: Optional[bool] = None
    notify_attendance: Optional[bool] = None
    notify_weekly_report: Optional[bool] = None
    notify_lesson_deviation: Optional[bool] = None
    notify_institutional: Optional[bool] = None
