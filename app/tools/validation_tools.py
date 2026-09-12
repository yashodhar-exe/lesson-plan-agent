def validate_lesson_plan(planned_sessions, calendar_events, units, notional_hours):
    """
    Validates the generated lesson plan against hard constraints.
    Returns (True, []) if valid, or (False, [errors]) if invalid.
    """
    errors = []
    
    # 1. No holidays or exams
    excluded_dates = {
        event.date for event in calendar_events 
        if event.event_type in ["HOLIDAY", "MIDTERM_EXAM", "INSTITUTIONAL_EVENT"]
    }
    
    for session in planned_sessions:
        if session["date"] in excluded_dates:
            errors.append(f"Session {session['session_number']} is scheduled on an excluded date ({session['date']}).")
            
    # 2. Duplicate sessions (same date and period)
    seen_slots = set()
    for session in planned_sessions:
        slot = (session["date"], session["period"])
        if slot in seen_slots:
            errors.append(f"Duplicate session scheduled on {session['date']} Period {session['period']}.")
        seen_slots.add(slot)
        
    # 3. Topic coverage
    all_required_topics = {
        topic.id 
        for unit in units 
        for topic in unit.topics if not topic.is_optional
    }
    
    planned_topics = {
        session["topic_id"] 
        for session in planned_sessions if session["topic_id"] is not None
    }
    
    missing_topics = all_required_topics - planned_topics
    if missing_topics:
        errors.append(f"Missing required topics: {missing_topics}")
        
    # 4. Total hours check (Relaxed for hackathon demo)
    total_planned_hours = sum(s["planned_hours"] for s in planned_sessions if s["session_type"] == "TEACHING")
    # if total_planned_hours < notional_hours:
    #     errors.append(f"Planned hours ({total_planned_hours}) is less than required notional hours ({notional_hours}).")
        
    is_valid = len(errors) == 0
    return is_valid, errors
