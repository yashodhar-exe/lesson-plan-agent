import React, { useState, useEffect } from 'react';

const LessonPlans = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch courses
    fetch('http://localhost:8000/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        if (data.length > 0) setSelectedCourse(data[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    fetch(`http://localhost:8000/api/courses/${selectedCourse}/sections`)
      .then(res => res.json())
      .then(data => {
        setSections(data);
        if (data.length > 0) setSelectedSection(data[0].id);
        else setSelectedSection('');
      })
      .catch(err => console.error(err));
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || !selectedSection) {
      setPlanData(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/api/lesson-plans/search?course_id=${selectedCourse}&section_id=${selectedSection}`)
      .then(res => {
        if (!res.ok) throw new Error("Plan not found for this section.");
        return res.json();
      })
      .then(data => setPlanData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCourse, selectedSection]);

  const sessions = planData?.sessions || [];
  
  // Calculate metrics
  const totalSessions = sessions.length;
  const completed = sessions.filter(s => s.status === 'COMPLETED').length;
  const completionRate = totalSessions > 0 ? ((completed / totalSessions) * 100).toFixed(1) : 0;
  const pending = sessions.filter(s => s.status === 'PLANNED' || s.status === 'AVAILABLE' || s.status === 'EXTRA').length;

  return (
    <div className="w-full h-full">
      <div className="flex-1 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        {/* PAGE HEADER */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-brand-text tracking-tight">Lesson Plans</h1>
            <p className="text-sm text-brand-secondary mt-1 max-w-3xl">
              Daily instructional plans, learning outcomes, and delivery pace aligned to institutional autonomous syllabus.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-4 h-9 bg-white border border-brand-border text-brand-text text-sm rounded hover:bg-brand-surface transition-colors" type="button">
              <span className="material-symbols-outlined text-brand-secondary text-sm">picture_as_pdf</span>
              <span>Export Plan (PDF)</span>
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 h-9 bg-brand-primary text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors" type="button">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>New Lesson Plan</span>
            </button>
          </div>
        </section>

        {/* CONTROLS & FILTER BAR */}
        <section className="bg-white border border-brand-border rounded p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Course Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-brand-secondary" htmlFor="course-select">Course</label>
              <div className="relative">
                <select 
                  className="h-9 pr-8 pl-3 text-sm bg-white border border-brand-border rounded text-brand-text focus:border-brand-primary focus:ring-0 focus:outline-none cursor-pointer" 
                  id="course-select"
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
            </div>
            {/* Section Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-brand-secondary" htmlFor="section-select">Section</label>
              <div className="relative">
                <select 
                  className="h-9 pr-8 pl-3 text-sm bg-white border border-brand-border rounded text-brand-text focus:border-brand-primary focus:ring-0 focus:outline-none cursor-pointer" 
                  id="section-select"
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                  disabled={sections.length === 0}
                >
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  {sections.length === 0 && <option value="">No sections mapped</option>}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* KEY SUMMARY METRICS STRIP */}
        {planData && !loading && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Total Sessions */}
            <div className="bg-white border border-brand-border rounded p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-secondary tracking-wider uppercase">TOTAL SESSIONS</span>
                <span className="material-symbols-outlined text-brand-secondary text-sm">event_note</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-brand-text tracking-tight">{totalSessions}</span>
                <span className="text-sm text-brand-secondary">planned lectures</span>
              </div>
            </div>
            {/* Metric 2: Completed */}
            <div className="bg-white border border-brand-border rounded p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-secondary tracking-wider uppercase">COMPLETED</span>
                <span className="material-symbols-outlined text-brand-primary text-sm">check_circle</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-brand-text tracking-tight">{completed}</span>
                <span className="text-sm text-brand-primary font-medium">({completionRate}%)</span>
              </div>
              <div className="w-full bg-brand-surface h-1.5 rounded mt-2 overflow-hidden">
                <div className="bg-brand-primary h-full rounded" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
            {/* Metric 3: Pending */}
            <div className="bg-white border border-brand-border rounded p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-secondary tracking-wider uppercase">REMAINING SESSIONS</span>
                <span className="material-symbols-outlined text-brand-secondary text-sm">pending_actions</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-brand-text tracking-tight">{pending}</span>
                <span className="text-sm text-brand-secondary">remaining</span>
              </div>
            </div>
            {/* Metric 4: Pace */}
            <div className="bg-white border border-brand-border rounded p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-secondary tracking-wider uppercase">STATUS</span>
                <span className="text-[11px] px-1.5 py-0.5 bg-brand-surface text-brand-primary font-medium rounded">{planData.status}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-semibold text-brand-text">Active Plan</span>
              </div>
            </div>
          </section>
        )}

        {/* MAIN CONTENT TABLE CONTAINER */}
        {(planData || loading || error) && (
          <section className="bg-white border border-brand-border rounded overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-brand-surface border-b border-brand-border flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-brand-text">Instructional Delivery Roster</span>
              </div>
            </div>
            
            {loading && (
              <div className="p-8 text-center text-brand-secondary">Loading lesson plan...</div>
            )}
            
            {error && !loading && (
              <div className="p-8 text-center text-brand-alert bg-brand-alert/5">{error}</div>
            )}

          {!loading && !error && planData && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-surface border-b border-brand-border text-brand-secondary text-xs tracking-wider uppercase">
                    <th className="py-2.5 px-4 w-16" scope="col">PLAN</th>
                    <th className="py-2.5 px-4 w-44" scope="col">SCHEDULED DATE</th>
                    <th className="py-2.5 px-4" scope="col">TOPIC & CORE INSTRUCTIONAL CONTENT</th>
                    <th className="py-2.5 px-4 w-44" scope="col">PEDAGOGICAL METHOD</th>
                    <th className="py-2.5 px-4 w-32" scope="col">DELIVERY STATUS</th>
                    <th className="py-2.5 px-4 text-right w-24" scope="col">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {sessions.map(session => {
                    const isNextUp = session.status === 'PLANNED';
                    const isCompleted = session.status === 'COMPLETED';
                    const isBuffer = session.session_type === 'BUFFER';
                    
                    return (
                      <tr key={session.id} className={`${isNextUp ? 'bg-blue-50/50 border-l-2 border-l-brand-primary' : 'hover:bg-brand-surface/50'} transition-colors`}>
                        <td className={`py-3 px-4 font-medium ${isNextUp ? 'text-brand-primary' : 'text-brand-text'}`}>
                          L{session.session_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className={`font-medium ${isNextUp ? 'text-brand-primary' : 'text-brand-text'}`}>
                            {session.date ? new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Unscheduled'}
                          </div>
                          <div className="text-xs text-brand-secondary">Period {session.period}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`font-medium ${isNextUp ? 'text-brand-text' : 'text-brand-text'}`}>
                            {session.topic_name}
                          </div>
                          {isBuffer && <div className="text-brand-secondary text-xs mt-0.5">Extra session for revision or catch-up</div>}
                        </td>
                        <td className="py-3 px-4 text-brand-secondary">
                          <span className="inline-flex items-center gap-1 text-xs">
                            <span className="material-symbols-outlined text-sm">{isBuffer ? 'restart_alt' : 'cast_for_education'}</span>
                            {session.teaching_method || (isBuffer ? 'Revision' : 'Lecture')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium ${
                            isCompleted ? 'bg-green-50 text-green-700 border-green-200' :
                            isNextUp ? 'bg-blue-50 text-brand-primary border-brand-primary' :
                            'bg-gray-50 text-brand-secondary border-brand-border'
                          }`}>
                            <span className="material-symbols-outlined text-sm">
                              {isCompleted ? 'check' : isNextUp ? 'schedule' : 'event'}
                            </span>
                            {session.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-brand-primary hover:text-blue-800 font-medium text-sm inline-flex items-center gap-0.5 transition-colors">
                            {isCompleted ? 'View' : 'Edit'}
                            <span className="material-symbols-outlined text-sm">
                              {isCompleted ? 'arrow_forward' : 'edit_note'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}
      </div>
    </div>
  );
};

export default LessonPlans;
