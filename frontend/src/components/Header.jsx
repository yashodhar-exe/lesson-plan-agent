import React from 'react';

import vignanLogo from '../assets/vignan.png';

const Header = ({ faculty }) => {
  return (
    <header className="h-16 px-10 flex items-center justify-end bg-brand-bg sticky top-0 z-20">
      <div className="flex items-center gap-5">
        {/* Semester Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-brand-border/70 text-[12px] text-brand-secondary bg-white">
          <span className="material-symbols-outlined text-[15px] text-brand-muted">school</span>
          <span>CSE · Sem I · 2026–27</span>
          <span className="material-symbols-outlined text-[14px] text-brand-muted">expand_more</span>
        </div>
        
        <div className="h-4 w-px bg-brand-border/60"></div>
        
        {/* Faculty Profile Badge */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-xs font-medium text-brand-text">
              {faculty ? faculty.name : 'Loading...'}
            </span>
            <span className="text-[11px] text-brand-muted ml-1">(Dept. of Computer Science)</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-border/50 flex items-center justify-center shadow-sm bg-white p-0.5">
            <img src={vignanLogo} alt="Profile" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
