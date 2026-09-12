import React from 'react';

const Settings = () => {
  return (
    <div className="w-full h-full relative">
      {/* Main Workspace Content */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full pb-32">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-brand-text tracking-tight">System Configurations &amp; Preferences</h1>
          <p className="text-base text-brand-secondary mt-1">Manage your academic profile, notification preferences, and system defaults.</p>
        </header>

        {/* Vertical Stack of Form Cards */}
        <div className="space-y-6">
          
          {/* SECTION 1: PROFILE & ACCOUNT INFORMATION */}
          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-text">Profile &amp; Account Information</h2>
                <p className="text-sm text-brand-secondary">Synced with the Autonomous University Registrar &amp; HRMS Records</p>
              </div>
              <span className="px-2.5 py-1 bg-brand-surface border border-brand-border rounded text-xs text-brand-secondary flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-brand-primary" style={{ fontSize: '0.95rem' }}>lock</span>
                Verified Academic Credential
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Faculty Portrait Frame & Secondary Action */}
              <div className="flex flex-col items-center gap-2 w-full md:w-44 flex-shrink-0">
                <div className="w-32 h-32 rounded-lg border border-brand-border bg-brand-surface flex flex-col items-center justify-center text-brand-primary relative overflow-hidden">
                  <span className="text-2xl font-semibold tracking-wider">AS</span>
                  <span className="text-xs text-brand-secondary mt-1 font-semibold uppercase tracking-widest">Faculty ID</span>
                </div>
                <button className="text-sm text-brand-primary hover:underline flex items-center gap-1 font-medium mt-1" type="button">
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>photo_camera</span>
                  <span>Update Photo</span>
                </button>
              </div>

              {/* Faculty Info Grid (2 Columns) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Faculty Name</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value="Dr. A. R. Sharma" />
                </div>
                {/* Designation */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Designation</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value="Professor &amp; Senior Research Mentor" />
                </div>
                {/* Department */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Department</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value="Computer Science &amp; Engineering" />
                </div>
                {/* Institutional Email */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Institutional Email</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="email" value="a.r.sharma@vignan.edu" />
                </div>
                {/* Employee ID */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Employee ID</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg font-mono text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value="FAC-CSE-2014-089" />
                </div>
                {/* Academic Affiliation */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Academic Affiliation</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value="Autonomous Board of Studies (BOS) Member" />
                </div>
              </div>
            </div>
            
            {/* Bottom Notice & Action */}
            <div className="mt-6 pt-4 border-t border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-brand-secondary">
                <span className="material-symbols-outlined text-brand-secondary" style={{ fontSize: '1.1rem' }}>info</span>
                <span>Institutional identity details are locked to Registrar HRMS records.</span>
              </div>
              <button className="text-brand-primary font-medium hover:underline flex items-center gap-1" type="button">
                <span>Request Data Correction</span>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>open_in_new</span>
              </button>
            </div>
          </section>

          {/* SECTION 2: ACADEMIC PREFERENCES */}
          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="pb-4 border-b border-brand-border mb-6">
              <h2 className="text-xl font-semibold text-brand-text">Academic Preferences &amp; Agent Defaults</h2>
              <p className="text-sm text-brand-secondary mt-1">Tailor lesson planning algorithms, curriculum matrices, and syllabus pacing heuristics.</p>
            </div>
            <div className="space-y-6">
              
              {/* Default Academic Term Select */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <div>
                  <label className="text-base font-medium text-brand-text block" htmlFor="academic-term">Default Academic Term</label>
                  <span className="text-sm text-brand-secondary">Primary active curriculum context for all planning modules.</span>
                </div>
                <div className="md:col-span-2">
                  <select className="w-full md:w-80 h-9 px-3 bg-white border border-brand-border rounded-lg text-sm text-brand-text focus:border-brand-primary focus:outline-none" id="academic-term">
                    <option defaultValue>CSE Sem I 2026–27 (Active)</option>
                    <option>CSE Sem II 2025–26 (Archived)</option>
                    <option>Autonomous Regulation R-23</option>
                  </select>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              {/* Lesson Plan Granularity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <div>
                  <span className="text-base font-medium text-brand-text block">Lesson Plan Granularity</span>
                  <span className="text-sm text-brand-secondary">Determines the structuring fidelity generated by the planning assistant.</span>
                </div>
                <div className="md:col-span-2 space-y-3">
                  {/* Option 1: Selected */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-brand-primary bg-brand-surface cursor-pointer">
                    <input defaultChecked className="mt-1 h-4 w-4 text-brand-primary border-brand-border" name="granularity" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-text">Daily Lecture-wise (Recommended)</span>
                      <span className="text-sm text-brand-secondary">Detailed 50-minute period breakdown with specific Bloom's taxonomy mapping and session deliverables.</span>
                    </div>
                  </label>
                  {/* Option 2 */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-surface cursor-pointer transition-colors">
                    <input className="mt-1 h-4 w-4 text-brand-primary border-brand-border" name="granularity" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-text">Weekly Module-wise</span>
                      <span className="text-sm text-brand-secondary">Aggregated unit goals, laboratory sync milestones, and combined deliverables per calendar week.</span>
                    </div>
                  </label>
                  {/* Option 3 */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-brand-border hover:bg-brand-surface cursor-pointer transition-colors">
                    <input className="mt-1 h-4 w-4 text-brand-primary border-brand-border" name="granularity" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-text">Outcome Milestone-wise</span>
                      <span className="text-sm text-brand-secondary">Curriculum structured purely by Course Outcome (CO-PO) attainment checkpoints and continuous assessments.</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              {/* Buffer Classes Allowance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <div>
                  <label className="text-base font-medium text-brand-text block" htmlFor="buffer-classes">Buffer Classes Allowance</label>
                  <span className="text-sm text-brand-secondary">Automatic contingency provisioning.</span>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input className="w-20 h-9 px-3 text-center bg-white border border-brand-border rounded-lg font-mono text-sm text-brand-text focus:border-brand-primary focus:outline-none" id="buffer-classes" max="6" min="0" type="number" defaultValue="2" />
                    <span className="text-sm text-brand-text">buffer classes per unit</span>
                  </div>
                  <p className="text-sm text-brand-secondary mt-2">
                    Automatically provisions contingency review slots in the timetable when syllabus pace falls behind baseline metrics.
                  </p>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              {/* Automatic Timetable Re-planning Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <div>
                  <span className="text-base font-medium text-brand-text block">Automatic Timetable Re-planning</span>
                  <span className="text-sm text-brand-secondary">Institutional holiday collision handling.</span>
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-sm text-brand-secondary pr-4">
                    Allow Lesson Plan Agent to suggest schedule swaps when lectures collide with institutional holidays or symposiums.
                  </p>
                  {/* Switch Enabled */}
                  <button aria-checked="true" className="w-11 h-6 bg-brand-primary rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0" role="switch" type="button">
                    <span className="translate-x-5 inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm"></span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: NOTIFICATIONS & ALERTS */}
          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="pb-4 border-b border-brand-border mb-6">
              <h2 className="text-xl font-semibold text-brand-text">Notifications &amp; System Alerts</h2>
              <p className="text-sm text-brand-secondary mt-1">Establish thresholds for automated curriculum alerts, audit reports, and departmental feeds.</p>
            </div>
            <div className="divide-y divide-brand-border">
              {/* Notification Item 1 */}
              <div className="py-4 flex items-center justify-between gap-3 first:pt-0">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Email alerts for attendance deficits</span>
                  <span className="text-sm text-brand-secondary">Notify when student attendance falls below autonomous threshold (&lt;75%) in CSE-A, CSE-C, or CSE-F.</span>
                </div>
                <button aria-checked="true" className="w-11 h-6 bg-brand-primary rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0" role="switch" type="button">
                  <span className="translate-x-5 inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm"></span>
                </button>
              </div>
              {/* Notification Item 2 */}
              <div className="py-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Weekly summary reports</span>
                  <span className="text-sm text-brand-secondary">Deliver weekly syllabus execution, completed deliveries, and pace audit every Friday at 5:00 PM.</span>
                </div>
                <button aria-checked="true" className="w-11 h-6 bg-brand-primary rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0" role="switch" type="button">
                  <span className="translate-x-5 inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm"></span>
                </button>
              </div>
              {/* Notification Item 3 */}
              <div className="py-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Lesson plan deviation alerts</span>
                  <span className="text-sm text-brand-secondary">Instant notification when an assigned section runs 1 or more sessions behind baseline syllabus schedule.</span>
                </div>
                <button aria-checked="true" className="w-11 h-6 bg-brand-primary rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0" role="switch" type="button">
                  <span className="translate-x-5 inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm"></span>
                </button>
              </div>
              {/* Notification Item 4 */}
              <div className="py-4 flex items-center justify-between gap-3 last:pb-0">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Institutional announcements &amp; BOS updates</span>
                  <span className="text-sm text-brand-secondary">Academic council notices, syllabus revision drafts, and NAAC/NBA compliance deadlines.</span>
                </div>
                <button aria-checked="true" className="w-11 h-6 bg-brand-primary rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0" role="switch" type="button">
                  <span className="translate-x-5 inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm"></span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4: SYSTEM APPEARANCE */}
          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="pb-4 border-b border-brand-border mb-6">
              <h2 className="text-xl font-semibold text-brand-text">System Appearance &amp; Interface</h2>
              <p className="text-sm text-brand-secondary mt-1">Select interface presentation modes and typographical scaling for prolonged academic review sessions.</p>
            </div>
            <div className="space-y-6">
              {/* Theme Selection Cards */}
              <div>
                <span className="text-base font-medium text-brand-text block mb-3">Color Mode</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: System Default (Selected) */}
                  <div className="relative rounded-lg border-2 border-brand-primary bg-brand-surface p-4 cursor-pointer flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-brand-text">System Default</span>
                        <span className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>
                        </span>
                      </div>
                      <div className="h-16 rounded border border-brand-border bg-gray-50 flex overflow-hidden">
                        <div className="w-1/4 bg-brand-surface border-r border-brand-border"></div>
                        <div className="w-3/4 p-1.5 space-y-1">
                          <div className="h-2 w-12 bg-brand-primary rounded-sm"></div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-sm"></div>
                          <div className="h-1.5 w-4/5 bg-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-brand-secondary mt-3 block">Follows operational OS theme schedule</span>
                  </div>
                  {/* Card 2: Light Mode */}
                  <div className="relative rounded-lg border border-brand-border bg-white p-4 hover:border-brand-primary cursor-pointer transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-brand-text">Light</span>
                      </div>
                      <div className="h-16 rounded border border-brand-border bg-white flex overflow-hidden">
                        <div className="w-1/4 bg-brand-surface border-r border-brand-border"></div>
                        <div className="w-3/4 p-1.5 space-y-1">
                          <div className="h-2 w-10 bg-brand-border rounded-sm"></div>
                          <div className="h-1.5 w-full bg-gray-200 rounded-sm"></div>
                          <div className="h-1.5 w-3/4 bg-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-brand-secondary mt-3 block">High-contrast academic print layout</span>
                  </div>
                  {/* Card 3: Dark Mode */}
                  <div className="relative rounded-lg border border-brand-border bg-white p-4 hover:border-brand-primary cursor-pointer transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-brand-text">Dark</span>
                      </div>
                      <div className="h-16 rounded border border-gray-700 bg-gray-900 flex overflow-hidden">
                        <div className="w-1/4 bg-gray-800 border-r border-gray-700"></div>
                        <div className="w-3/4 p-1.5 space-y-1">
                          <div className="h-2 w-10 bg-blue-400 rounded-sm"></div>
                          <div className="h-1.5 w-full bg-gray-600 rounded-sm"></div>
                          <div className="h-1.5 w-3/4 bg-gray-600 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-brand-secondary mt-3 block">Restrained dark slate for evening analysis</span>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              {/* Font Density / Scale */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-base font-medium text-brand-text block">Font Density &amp; Typography Scale</span>
                  <span className="text-sm text-brand-secondary">Adjust interface scale for multi-column syllabus matrices.</span>
                </div>
                <div className="inline-flex rounded-lg border border-brand-border p-1 bg-brand-surface">
                  <button className="px-3 py-1.5 text-sm text-brand-secondary hover:text-brand-text rounded transition-colors" type="button">
                    Compact (13px)
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium bg-white text-brand-primary shadow-sm border border-brand-border rounded" type="button">
                    Comfortable (Standard)
                  </button>
                  <button className="px-3 py-1.5 text-sm text-brand-secondary hover:text-brand-text rounded transition-colors" type="button">
                    Spacious (16px)
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* FOOTER ACTIONS (Sticky Bottom Docked Panel) */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-brand-border py-4 px-8 z-30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-brand-secondary">
            <span className="material-symbols-outlined text-brand-primary" style={{ fontSize: '1.1rem' }}>sync</span>
            <span>Last updated: Oct 18, 2026 · Synced with Autonomous Faculty Registry</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-brand-border rounded-lg text-sm font-medium text-brand-secondary hover:bg-brand-surface hover:text-brand-text transition-colors" type="button">
              Discard Changes
            </button>
            <button className="px-5 py-2 bg-brand-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-none flex items-center gap-1.5" type="button">
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>save</span>
              <span>Save Configurations</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
