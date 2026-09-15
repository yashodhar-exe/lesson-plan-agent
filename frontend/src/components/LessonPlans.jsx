import React, { useState, useEffect } from 'react';

const LessonPlans = ({ facultyId, setCurrentView }) => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchPlanData = () => {
    if (!selectedCourse || !selectedSection) return;
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/api/lesson-plans/search?course_id=${selectedCourse}&section_id=${selectedSection}`)
      .then(res => {
        if (!res.ok) throw new Error("Plan not found for this section.");
        return res.json();
      })
      .then(data => setPlanData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleUpdateSessionStatus = async (sessionId, status) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lesson-plans/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update session");
      
      // Refresh the plan
      fetchPlanData();
      setEditingSessionId(null);
    } catch (err) {
      console.error(err);
      alert("Error updating session: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    // Fetch courses for specific faculty
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/courses`)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        if (data.length > 0) setSelectedCourse(data[0].id);
      })
      .catch(err => console.error(err));
  }, [facultyId]);

  useEffect(() => {
    if (!selectedCourse) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/${selectedCourse}/sections`)
      .then(res => res.json())
      .then(data => {
        setSections(data);
        if (data.length > 0) setSelectedSection(data[0].id);
        else setSelectedSection('');
      })
      .catch(err => console.error(err));
  }, [selectedCourse]);

  useEffect(() => {
    fetchPlanData();
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
        <section className="print:hidden flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-brand-text tracking-tight">Lesson Plans</h1>
            <p className="text-sm text-brand-secondary mt-1 max-w-3xl">
              Daily instructional plans, learning outcomes, and delivery pace aligned to institutional autonomous syllabus.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 h-9 bg-white border border-brand-border text-brand-text text-sm rounded hover:bg-brand-surface transition-colors" type="button">
              <span className="material-symbols-outlined text-brand-secondary text-sm">picture_as_pdf</span>
              <span>Export Plan (PDF)</span>
            </button>
            <button onClick={() => setCurrentView && setCurrentView('my-courses')} className="inline-flex items-center gap-1.5 px-4 h-9 bg-brand-primary text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors" type="button">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>New Lesson Plan</span>
            </button>
          </div>
        </section>

        {/* CONTROLS & FILTER BAR */}
        <section className="print:hidden bg-white border border-brand-border rounded p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
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
          <section className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <span className="text-base font-semibold text-brand-text">Schedule</span>
              </div>
            </div>
            
            {loading && (
              <div className="p-16 flex flex-col items-center justify-center gap-4 text-brand-secondary">
                <l-chaotic-orbit size="35" speed="1.5" color="#1e40af"></l-chaotic-orbit>
              </div>
            )}
            
            {error && !loading && (
              <div className="p-8 text-center text-brand-alert bg-brand-alert/5">{error}</div>
            )}

          {!loading && !error && planData && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-surface border-b border-brand-border text-brand-secondary text-xs tracking-wider uppercase">
                    <th className="py-2.5 px-4 w-16 text-center" scope="col">PLAN</th>
                    <th className="py-2.5 px-4 w-44" scope="col">DATE</th>
                    <th className="py-2.5 px-4" scope="col">TOPIC</th>
                    <th className="py-2.5 px-4 w-32 text-center" scope="col">METHOD</th>
                    <th className="py-2.5 px-4 w-32 text-center" scope="col">STATUS</th>
                    <th className="py-2.5 px-4 w-24 text-center" scope="col">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm">
                  {sessions.map(session => {
                    const isNextUp = session.status === 'PLANNED';
                    const isCompleted = session.status === 'COMPLETED';
                    const isBuffer = session.session_type === 'BUFFER';
                    
                    return (
                      <tr key={session.id} className="hover:bg-brand-surface/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-brand-text text-center">
                          L{session.session_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-brand-text">
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
                        <td className="py-3 px-4 text-brand-secondary text-center">
                          <span className="inline-flex items-center justify-center gap-1 text-xs">
                            <span className="material-symbols-outlined text-sm">{isBuffer ? 'restart_alt' : 'cast_for_education'}</span>
                            {session.teaching_method || (isBuffer ? 'Revision' : 'Lecture')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center justify-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium ${
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
                        <td className="py-3 px-4 text-center">
                          {editingSessionId === session.id ? (
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleUpdateSessionStatus(session.id, 'COMPLETED')}
                                disabled={updatingStatus}
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                              >
                                Done
                              </button>
                              <button 
                                onClick={() => handleUpdateSessionStatus(session.id, 'DELAYED')}
                                disabled={updatingStatus}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                              >
                                Delayed
                              </button>
                              <button 
                                onClick={() => setEditingSessionId(null)}
                                disabled={updatingStatus}
                                className="text-xs text-brand-secondary hover:text-brand-text transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => !isCompleted && setEditingSessionId(session.id)}
                              className={`font-medium text-sm inline-flex items-center justify-center gap-0.5 transition-colors ${isCompleted ? 'text-brand-secondary cursor-default' : 'text-brand-primary hover:text-blue-800'}`}
                            >
                              {isCompleted ? 'Done' : 'Edit'}
                              <span className="material-symbols-outlined text-sm">
                                {isCompleted ? 'check' : 'edit_note'}
                              </span>
                            </button>
                          )}
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
