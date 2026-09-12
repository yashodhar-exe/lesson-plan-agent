import pytest
from datetime import date
from app.tools.planning_engine import get_available_teaching_slots
from app.models import TimetableSlot, CalendarEvent, EventType

def test_available_slots():
    start = date(2026, 8, 1)
    end = date(2026, 8, 7) # one week
    
    # Monday is August 3, 2026
    slots = [
        TimetableSlot(day_of_week="Monday", period_number=1)
    ]
    
    events = [
        # Holiday on Monday
        CalendarEvent(date=date(2026, 8, 3), event_type=EventType.HOLIDAY)
    ]
    
    # Expected to return 0 slots because Monday is a holiday
    available = get_available_teaching_slots(start, end, slots, events)
    assert len(available) == 0

def test_available_slots_no_holiday():
    start = date(2026, 8, 1)
    end = date(2026, 8, 7) # one week
    
    slots = [
        TimetableSlot(day_of_week="Monday", period_number=1)
    ]
    
    events = []
    
    available = get_available_teaching_slots(start, end, slots, events)
    assert len(available) == 1
    assert available[0]["date"] == date(2026, 8, 3)
    assert available[0]["period"] == 1
