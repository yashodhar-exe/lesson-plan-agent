import React from 'react';

const Alerts = () => {
  return (
    <aside className="lg:w-80 shrink-0">
      <div className="bg-white border border-brand-alert/20 rounded p-5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-alert"></div>
        <div className="flex items-center gap-2 text-brand-alert mb-3">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <h3 className="text-sm font-semibold tracking-tight uppercase">Needs Attention</h3>
        </div>
        
        <div className="space-y-4 mt-4">
          {/* Alert 1 */}
          <div className="pb-4 border-b border-brand-border/40 last:border-0 last:pb-0">
            <h4 className="text-[13px] font-medium text-brand-text leading-tight mb-1">
              Data Structures (IT-B)
            </h4>
            <p className="text-xs text-brand-secondary mb-2 leading-relaxed">
              You are <span className="font-semibold text-brand-alert">2 sessions behind</span> schedule based on the standard plan.
            </p>
            <button className="text-[11px] font-medium text-brand-alert hover:text-brand-alert/80 hover:underline underline-offset-2 transition-all">
              Initiate Replanning
            </button>
          </div>
          
          {/* Alert 2 */}
          <div className="pb-4 border-b border-brand-border/40 last:border-0 last:pb-0">
            <h4 className="text-[13px] font-medium text-brand-text leading-tight mb-1">
              Mid-Semester Exam Approaching
            </h4>
            <p className="text-xs text-brand-secondary mb-2 leading-relaxed">
              Ensure syllabus units 1-3 are completed for all assigned sections.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Alerts;
