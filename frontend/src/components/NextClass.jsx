import React from 'react';

const NextClass = ({ nextClass }) => {
  if (!nextClass) {
    return (
      <section className="mb-10">
        <div className="bg-white border border-brand-border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-brand-secondary">No upcoming classes scheduled.</p>
        </div>
      </section>
    );
  }

  // Format date if needed, fallback to placeholder
  const displayDate = nextClass.date ? new Date(nextClass.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Upcoming';

  return (
    <section className="mb-10">
      <div className="bg-white border border-brand-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            {/* Eyebrow & Session time / venue */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-semibold tracking-wider text-brand-primary uppercase">Next Class</span>
              <span className="w-1 h-1 rounded-full bg-brand-border"></span>
              <span className="text-xs text-brand-secondary">{displayDate} · Period {nextClass.period}</span>
            </div>
            {/* Course title and section */}
            <h2 className="text-[20px] font-semibold text-brand-text leading-normal">
              {nextClass.course_name || 'Course Name'} <span className="font-normal text-brand-secondary">— {nextClass.section_name || 'Section'}</span>
            </h2>
            {/* Operational details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-secondary pt-0.5">
              <div><span className="text-brand-muted">Topic:</span> {nextClass.topic_name || 'Various Topics'}</div>
              <span className="text-brand-border hidden sm:inline">|</span>
              <div><span className="text-brand-muted">Method:</span> {nextClass.teaching_method || 'Standard Lecture'}</div>
            </div>
          </div>
          {/* Primary single action */}
          <div className="shrink-0 lg:pl-6">
            <a className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline underline-offset-4 transition-all" href="#">
              <span>View Lesson Plan</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextClass;
