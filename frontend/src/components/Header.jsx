import React from 'react';
import { supabase } from '../lib/supabase';
import vignanLogo from '../assets/vignan.png';

const Header = ({ faculty, session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userEmail = session?.user?.email || '';

  return (
    <header className="h-16 pl-10 pr-6 flex items-center justify-end bg-brand-bg sticky top-0 z-20">
      <div className="flex items-center gap-5">
        {/* Semester Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-brand-border/70 text-[12px] text-brand-secondary bg-white">
          <span className="material-symbols-outlined text-[15px] text-brand-muted">school</span>
          <span>CSE · Sem I · 2026–27</span>
          <span className="material-symbols-outlined text-[14px] text-brand-muted">expand_more</span>
        </div>

        <div className="h-4 w-px bg-brand-border/60"></div>

        {/* Faculty Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="text-left mr-2">
            <span className="text-xs font-medium text-brand-text block">
              {faculty ? faculty.name : userEmail}
            </span>
            <span className="text-[11px] text-brand-muted">(Dept. of Computer Science)</span>
          </div>
          <div className="relative group cursor-pointer" onClick={handleLogout} title="Click to Sign Out">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-border/50 flex items-center justify-center shadow-sm bg-white p-0.5 group-hover:border-red-400 transition-colors">
              <img src={vignanLogo} alt="Profile" className="w-full h-full object-contain group-hover:opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
