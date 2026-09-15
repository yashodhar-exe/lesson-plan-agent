import React, { useState, useEffect } from 'react';

const Progress = ({ facultyId }) => {
  const [workload, setWorkload] = useState({ sections: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facultyId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/workload`)
      .then(res => res.json())
      .then(data => {
        setWorkload(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch progress data.");
        setLoading(false);
      });
  }, [facultyId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4 text-brand-secondary">
        <l-chaotic-orbit size="35" speed="1.5" color="#1e40af"></l-chaotic-orbit>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-brand-alert bg-brand-alert/5">{error}</div>;
  }

  const sections = workload.sections || [];
  const totalTarget = sections.reduce((sum, sec) => sum + sec.target_sessions, 0);
  const totalCompleted = sections.reduce((sum, sec) => sum + sec.completed_sessions, 0);
  const aggregateCompletion = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  return (
    <div className="w-full h-full">
      <div className="flex-1 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        {/* Section: Page Header & Global Context Controls */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-brand-text tracking-tight">Course Execution &amp; Academic Progress</h1>
            <p className="text-sm text-brand-secondary max-w-3xl">
              Monitor syllabus coverage, student attendance metrics, and internal assessment timelines across all assigned courses.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="px-4 py-1.5 bg-brand-surface border border-brand-border rounded text-xs font-semibold text-brand-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-brand-primary">schedule</span>
              <span>Week 9 of 16 (Academic Year 2026–2027)</span>
            </div>
            <button className="flex items-center gap-1 px-4 py-1.5 bg-white border border-brand-border rounded hover:bg-brand-surface transition-colors text-sm font-medium text-brand-text" type="button">
              <span className="material-symbols-outlined text-base text-brand-secondary">file_download</span>
              <span>Export Report (PDF)</span>
            </button>
          </div>
        </section>

        {/* Section: Overview Summary Metrics */}
        <section aria-label="Overview Summary Metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-brand-border rounded p-6 flex flex-col justify-between space-y-3 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Total Classes Conducted</span>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-semibold text-brand-text tabular-nums">{totalCompleted}</span>
                <span className="text-lg font-semibold text-brand-secondary tabular-nums">/ {totalTarget}</span>
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <div className="w-full bg-brand-surface h-1.5 rounded overflow-hidden">
                <div className="bg-brand-primary h-full rounded" style={{ width: aggregateCompletion + '%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-semibold pt-0.5">
                <span className="text-brand-primary font-medium">{aggregateCompletion}% of Semester Target</span>
                <span className="text-brand-secondary">{totalTarget - totalCompleted} sessions remain</span>
              </div>
            </div>
            <div className="pt-1 border-t border-brand-border text-xs font-semibold text-brand-secondary">
              On aggregate schedule across all cohorts
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded p-6 flex flex-col justify-between space-y-3 shadow-sm opacity-60">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Average Attendance</span>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-semibold text-brand-text tabular-nums">--</span>
              </div>
            </div>
            <div className="pt-1 border-t border-brand-border text-xs font-semibold text-brand-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-brand-primary">info</span>
              <span>Attendance sync currently unavailable</span>
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded p-6 flex flex-col justify-between space-y-3 shadow-sm opacity-60">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Internal Assessments</span>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-semibold text-brand-text tabular-nums">--</span>
              </div>
            </div>
            <div className="pt-1 border-t border-brand-border text-xs font-semibold text-brand-secondary">
              Assessment schedule sync currently unavailable
            </div>
          </div>
        </section>

        {/* Section: Detailed Course Progress List */}
        <section aria-label="Course Execution Worksheets" className="space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xl font-semibold text-brand-text tracking-tight">Active Academic Offerings ({sections.length})</h2>
          </div>

          {sections.length === 0 ? (
            <div className="p-8 text-center bg-white border border-brand-border rounded-lg shadow-sm text-brand-secondary">
              No active courses found. Head over to My Courses to set up your semester.
            </div>
          ) : (
            sections.map((section, idx) => {
              const pct = section.target_sessions > 0 ? Math.round((section.completed_sessions / section.target_sessions) * 100) : 0;
              return (
                <article key={idx} className="bg-white border border-brand-border rounded p-6 space-y-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-brand-text">{section.course_name}</span>
                        <span className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-xs font-medium text-brand-secondary tabular-nums">{section.course_code}</span>
                      </div>
                      <p className="text-sm text-brand-secondary">
                        Sections: <strong className="text-brand-text font-medium">{section.section_name}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-brand-secondary uppercase">Syllabus Coverage</span>
                        <span className="text-sm font-semibold text-brand-text tabular-nums">{pct}%</span>
                      </div>
                      <div className="w-full bg-brand-surface h-1.5 rounded overflow-hidden">
                        <div className="bg-brand-primary h-full rounded" style={{ width: pct + '%' }}></div>
                      </div>
                      <p className="text-xs font-semibold text-brand-secondary leading-snug pt-0.5">
                        Based on completed sessions
                      </p>
                    </div>
                    <div className="space-y-1 border-l-0 md:border-l border-brand-border md:pl-4">
                      <span className="text-xs font-semibold text-brand-secondary uppercase">Classes Held</span>
                      <p className="text-xl font-semibold text-brand-text tabular-nums">{section.completed_sessions} / {section.target_sessions}</p>
                      <p className="text-xs font-semibold text-brand-secondary">Planned Sessions</p>
                    </div>
                    <div className="space-y-1 border-l-0 md:border-l border-brand-border md:pl-4 opacity-60">
                      <span className="text-xs font-semibold text-brand-secondary uppercase">Student Attendance</span>
                      <p className="text-xl font-semibold text-brand-text tabular-nums">--</p>
                      <p className="text-xs font-semibold text-brand-secondary">Average cohort attendance</p>
                    </div>
                    <div className="space-y-1 border-l-0 md:border-l border-brand-border md:pl-4 opacity-60">
                      <span className="text-xs font-semibold text-brand-secondary uppercase">Next Milestone</span>
                      <p className="text-base font-medium text-brand-text leading-snug">--</p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

      </div>
    </div>
  );
};

export default Progress;
