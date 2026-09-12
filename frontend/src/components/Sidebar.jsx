import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-brand-bg border-r border-brand-border/60 z-30 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Wordmark */}
        <a href="/" onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }} className="h-16 px-6 flex flex-col justify-center border-b border-brand-border/50 hover:bg-brand-surface/30 transition-colors">
          <span className="text-base font-semibold tracking-tight text-brand-text">VignanAI</span>
          <span className="text-[11px] text-brand-muted font-normal tracking-normal">Academic Planning</span>
        </a>

        {/* Navigation Links */}
        <nav className="flex flex-col py-4 px-3 gap-2">
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'dashboard' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('my-courses'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'my-courses' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>My Courses</span>
          </a>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('lesson-plans'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'lesson-plans' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">assignment</span>
            <span>Lesson Plans</span>
          </a>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('calendar'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'calendar' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>Calendar</span>
          </a>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('progress'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'progress' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span>Progress</span>
          </a>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('reports'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'reports' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Reports</span>
          </a>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('settings'); }}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${currentView === 'settings' ? 'font-medium bg-brand-surface text-brand-primary' : 'font-normal text-brand-secondary hover:text-brand-text hover:bg-brand-surface/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </a>
        </nav>
      </div>

    </aside>
  );
};

export default Sidebar;
