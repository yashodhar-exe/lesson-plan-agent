import React from 'react';

const CourseList = ({ sections = [] }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-brand-secondary uppercase tracking-wider">
          Your Assigment Workload
        </h3>
        <span className="text-xs text-brand-muted">{sections.length} Active Courses</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => {
          const target = section.target_sessions || 0;
          const completed = section.completed_sessions || 0;
          const pct = target > 0 ? Math.round((completed / target) * 100) : 0;

          return (
          <div key={index} className="bg-white border border-brand-border rounded p-4 shadow-sm hover:border-brand-border/80 hover:shadow transition-all group">
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <h4 className="text-sm font-semibold text-brand-text mb-0.5 group-hover:text-brand-primary transition-colors cursor-pointer">
                  {section.course_name || 'Course Name'}
                </h4>
                <div className="text-[11px] text-brand-secondary font-medium">
                  Section: {section.section_name} <span className="text-brand-border mx-1">|</span> {section.academic_year}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-medium text-brand-primary">Active</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-brand-border/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-brand-secondary">Syllabus Completion</span>
                <span className="text-[11px] font-semibold text-brand-text">{pct}%</span>
              </div>
              {/* Simplistic Progress Bar */}
              <div className="h-1.5 w-full bg-brand-surface rounded overflow-hidden">
                <div className="h-full bg-brand-primary rounded" style={{ width: `${pct}%` }}></div>
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <div className="text-[10px] text-brand-muted">Target sessions: {target}</div>
                <a className="text-[11px] font-medium text-brand-primary flex items-center gap-0.5 hover:underline" href="#">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                </a>
              </div>
            </div>
          </div>
          );
        })}

        {sections.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-8 text-center text-brand-secondary text-sm">
            No active courses found for this faculty.
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseList;
