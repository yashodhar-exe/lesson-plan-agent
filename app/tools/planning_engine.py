from datetime import timedelta
from typing import List, Dict, Any

def get_available_teaching_slots(start_date, end_date, timetable_slots, calendar_events):
    """
    Expands timetable slots over a date range, excluding holidays and exams.
    """
    # Map weekday names to integers (0=Monday, 6=Sunday)
    weekday_map = {
        "Monday": 0, "Tuesday": 1, "Wednesday": 2,
        "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6
    }
    
    # Excluded dates from calendar
    excluded_dates = {
        event.date for event in calendar_events 
        if event.event_type in ["HOLIDAY", "MIDTERM_EXAM", "INSTITUTIONAL_EVENT"]
    }
    
    available_sessions = []
    current_date = start_date
    session_counter = 1
    
    while current_date <= end_date:
        if current_date not in excluded_dates:
            weekday = current_date.weekday()
            # Find matching slots for this day
            daily_slots = [s for s in timetable_slots if weekday_map.get(s.day_of_week) == weekday]
            
            # Sort by period to keep them in chronological order
            daily_slots.sort(key=lambda s: s.period_number)
            
            for slot in daily_slots:
                available_sessions.append({
                    "session_number": session_counter,
                    "date": current_date,
                    "period": slot.period_number,
                    "type": "AVAILABLE"
                })
                session_counter += 1
                
        current_date += timedelta(days=1)
        
    return available_sessions

def allocate_topics_to_sessions(available_sessions, units, buffers_per_unit=1):
    """
    Allocates topics to available sessions and inserts buffer sessions.
    Returns the planned sessions list.
    """
    planned_sessions = []
    session_idx = 0
    
    for unit in units:
        topics = sorted(unit.topics, key=lambda t: t.order)
        for topic in topics:
            if session_idx >= len(available_sessions):
                # Dynamically add an extra session to complete the academic semester plan
                last_session = available_sessions[-1] if available_sessions else None
                new_date = last_session["date"] + timedelta(days=1) if last_session and last_session["date"] else None
                available_sessions.append({
                    "session_number": session_idx + 1,
                    "date": new_date,
                    "period": 1,
                    "type": "EXTRA"
                })
            
            session = available_sessions[session_idx]
            planned_sessions.append({
                "session_number": session["session_number"],
                "date": session["date"],
                "period": session["period"],
                "unit_id": unit.id,
                "topic_id": topic.id,
                "topic_name": topic.name,
                "course_outcomes": topic.mapped_co_codes,
                "teaching_method": "LECTURE", # Default, can be overridden by LLM
                "planned_hours": 1.0,
                "session_type": "TEACHING",
                "status": "PLANNED"
            })
            session_idx += 1
            
        # Add buffer session for the unit if requested
        for _ in range(buffers_per_unit):
            if session_idx < len(available_sessions):
                session = available_sessions[session_idx]
                planned_sessions.append({
                    "session_number": session["session_number"],
                    "date": session["date"],
                    "period": session["period"],
                    "unit_id": unit.id,
                    "topic_id": None,
                    "course_outcomes": [],
                    "teaching_method": None,
                    "planned_hours": 1.0,
                    "session_type": "BUFFER",
                    "status": "AVAILABLE"
                })
                session_idx += 1
                
    return planned_sessions

def calculate_available_contact_capacity(start_date, end_date, timetable_slots, calendar_events):
    """
    Returns the exact integer count of teaching sessions available, resolving holidays.
    """
    sessions = get_available_teaching_slots(start_date, end_date, timetable_slots, calendar_events)
    return len(sessions)

def calculate_faculty_load(faculty_slots):
    """
    Given a list of TimetableSlot objects for a specific faculty member, 
    calculates their weekly teaching load in periods.
    Returns: { "total_periods_per_week": int, "sections_taught": list }
    """
    if not faculty_slots:
        return {"total_periods_per_week": 0, "sections_taught": []}
        
    sections = set(slot.section_id for slot in faculty_slots if slot.section_id)
    return {
        "total_periods_per_week": len(faculty_slots),
        "sections_taught": list(sections)
    }
