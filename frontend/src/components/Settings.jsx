import React, { useState, useEffect } from 'react';

const Settings = ({ faculty, session, onFacultyUpdate }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const [lastUpdated, setLastUpdated] = useState(() => formatTime(faculty?.last_settings_update));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [formData, setFormData] = useState({
    designation: faculty?.designation || 'Professor',
    academic_affiliation: faculty?.academic_affiliation || 'Autonomous Board of Studies (BOS) Member',
    default_academic_term: faculty?.default_academic_term || 'CSE Sem I 2026–27 (Active)',
    lesson_plan_granularity: faculty?.lesson_plan_granularity || 'Daily Lecture-wise',
    buffer_classes_allowance: faculty?.buffer_classes_allowance || 2,
    auto_replanning: faculty?.auto_replanning ?? true,
    notify_attendance: faculty?.notify_attendance ?? true,
    notify_weekly_report: faculty?.notify_weekly_report ?? true,
    notify_lesson_deviation: faculty?.notify_lesson_deviation ?? true,
    notify_institutional: faculty?.notify_institutional ?? true,
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        designation: faculty.designation || 'Professor',
        academic_affiliation: faculty.academic_affiliation || 'Autonomous Board of Studies (BOS) Member',
        default_academic_term: faculty.default_academic_term || 'CSE Sem I 2026–27 (Active)',
        lesson_plan_granularity: faculty.lesson_plan_granularity || 'Daily Lecture-wise',
        buffer_classes_allowance: faculty.buffer_classes_allowance ?? 2,
        auto_replanning: faculty.auto_replanning ?? true,
        notify_attendance: faculty.notify_attendance ?? true,
        notify_weekly_report: faculty.notify_weekly_report ?? true,
        notify_lesson_deviation: faculty.notify_lesson_deviation ?? true,
        notify_institutional: faculty.notify_institutional ?? true,
      });
      if (faculty.last_settings_update) {
        setLastUpdated(formatTime(faculty.last_settings_update));
      }
    }
  }, [faculty]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!faculty?.id) return;
    setIsSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`http://localhost:8000/api/faculty/${faculty.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setLastUpdated(formatTime(data.last_settings_update));
        setSaveMessage("Settings saved successfully!");
        if (onFacultyUpdate) onFacultyUpdate(data);
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Failed to save settings.");
      }
    } catch (err) {
      setSaveMessage("Error saving settings.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full pb-32">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-brand-text tracking-tight">System Configurations &amp; Preferences</h1>
          <p className="text-base text-brand-secondary mt-1">Manage your academic profile, notification preferences, and system defaults.</p>
        </header>

        <div className="space-y-6">
          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-text">Profile &amp; Account Information</h2>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2 w-full md:w-44 flex-shrink-0">
                <div className="w-32 h-32 rounded-lg border border-brand-border bg-brand-surface flex flex-col items-center justify-center text-brand-primary relative overflow-hidden">
                  <span className="text-2xl font-semibold tracking-wider">
                    {faculty?.name ? faculty.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'F'}
                  </span>
                  <span className="text-xs text-brand-secondary mt-1 font-semibold uppercase tracking-widest">Faculty ID</span>
                </div>
                <button className="text-sm text-brand-primary flex items-center gap-1 font-medium mt-1" type="button">
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>photo_camera</span>
                  <span>Update Photo</span>
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Faculty Name</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value={faculty?.name || "Faculty Member"} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Designation</label>
                  <input className="h-9 px-3 bg-white border border-brand-border rounded-lg text-sm text-brand-text focus:border-brand-primary focus:outline-none" type="text" value={formData.designation} onChange={e => handleChange('designation', e.target.value)} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Department</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value={faculty?.department_id || "Computer Science"} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Institutional Email</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="email" value={session?.user?.email || "faculty@example.com"} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Employee ID</label>
                  <input className="h-9 px-3 bg-brand-surface border border-brand-border rounded-lg font-mono text-sm text-brand-text cursor-not-allowed focus:ring-0" readOnly type="text" value={faculty?.id ? `FAC-${faculty.id.substring(0,8).toUpperCase()}` : "N/A"} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">Academic Affiliation</label>
                  <input className="h-9 px-3 bg-white border border-brand-border rounded-lg text-sm text-brand-text focus:border-brand-primary focus:outline-none" type="text" value={formData.academic_affiliation} onChange={e => handleChange('academic_affiliation', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="pb-4 border-b border-brand-border mb-6">
              <h2 className="text-xl font-semibold text-brand-text">Academic Preferences &amp; Agent Defaults</h2>
              <p className="text-sm text-brand-secondary mt-1">Tailor lesson planning algorithms, curriculum matrices, and syllabus pacing heuristics.</p>
            </div>
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <div>
                  <label className="text-base font-medium text-brand-text block" htmlFor="academic-term">Default Academic Term</label>
                  <span className="text-sm text-brand-secondary">Primary active curriculum context for all planning modules.</span>
                </div>
                <div className="md:col-span-2">
                  <select className="w-full md:w-80 h-9 px-3 bg-white border border-brand-border rounded-lg text-sm text-brand-text focus:border-brand-primary focus:outline-none" id="academic-term" value={formData.default_academic_term} onChange={e => handleChange('default_academic_term', e.target.value)}>
                    <option>CSE Sem I 2026–27 (Active)</option>
                    <option>CSE Sem II 2025–26 (Archived)</option>
                    <option>Autonomous Regulation R-23</option>
                  </select>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <div>
                  <span className="text-base font-medium text-brand-text block">Lesson Plan Granularity</span>
                  <span className="text-sm text-brand-secondary">Determines the structuring fidelity generated by the planning assistant.</span>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className={`flex items-start gap-3 p-3 rounded-lg border-2 ${formData.lesson_plan_granularity === 'Daily Lecture-wise' ? 'border-brand-primary bg-brand-surface' : 'border-brand-border hover:bg-brand-surface transition-colors'} cursor-pointer`}>
                    <input checked={formData.lesson_plan_granularity === 'Daily Lecture-wise'} onChange={() => handleChange('lesson_plan_granularity', 'Daily Lecture-wise')} className="mt-1 h-4 w-4 text-brand-primary border-brand-border" name="granularity" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-text">Daily Lecture-wise (Recommended)</span>
                      <span className="text-sm text-brand-secondary">Detailed 50-minute period breakdown with specific Bloom's taxonomy mapping and session deliverables.</span>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-lg border-2 ${formData.lesson_plan_granularity === 'Weekly Module-wise' ? 'border-brand-primary bg-brand-surface' : 'border-brand-border hover:bg-brand-surface transition-colors'} cursor-pointer`}>
                    <input checked={formData.lesson_plan_granularity === 'Weekly Module-wise'} onChange={() => handleChange('lesson_plan_granularity', 'Weekly Module-wise')} className="mt-1 h-4 w-4 text-brand-primary border-brand-border" name="granularity" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-text">Weekly Module-wise</span>
                      <span className="text-sm text-brand-secondary">Aggregated unit goals, laboratory sync milestones, and combined deliverables per calendar week.</span>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-lg border-2 ${formData.lesson_plan_granularity === 'Outcome Milestone-wise' ? 'border-brand-primary bg-brand-surface' : 'border-brand-border hover:bg-brand-surface transition-colors'} cursor-pointer`}>
                    <input checked={formData.lesson_plan_granularity === 'Outcome Milestone-wise'} onChange={() => handleChange('lesson_plan_granularity', 'Outcome Milestone-wise')} className="mt-1 h-4 w-4 text-brand-primary border-brand-border" name="granularity" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-text">Outcome Milestone-wise</span>
                      <span className="text-sm text-brand-secondary">Curriculum structured purely by Course Outcome (CO-PO) attainment checkpoints and continuous assessments.</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <div>
                  <label className="text-base font-medium text-brand-text block" htmlFor="buffer-classes">Buffer Classes Allowance</label>
                  <span className="text-sm text-brand-secondary">Automatic contingency provisioning.</span>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input className="w-20 h-9 px-3 text-center bg-white border border-brand-border rounded-lg font-mono text-sm text-brand-text focus:border-brand-primary focus:outline-none" id="buffer-classes" max="6" min="0" type="number" value={formData.buffer_classes_allowance} onChange={e => handleChange('buffer_classes_allowance', parseInt(e.target.value) || 0)} />
                    <span className="text-sm text-brand-text">buffer classes per unit</span>
                  </div>
                  <p className="text-sm text-brand-secondary mt-2">
                    Automatically provisions contingency review slots in the timetable when syllabus pace falls behind baseline metrics.
                  </p>
                </div>
              </div>
              
              <div className="h-px bg-brand-border"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <div>
                  <span className="text-base font-medium text-brand-text block">Automatic Timetable Re-planning</span>
                  <span className="text-sm text-brand-secondary">Institutional holiday collision handling.</span>
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-sm text-brand-secondary pr-4">
                    Allow Lesson Plan Agent to suggest schedule swaps when lectures collide with institutional holidays or symposiums.
                  </p>
                  <button onClick={() => handleChange('auto_replanning', !formData.auto_replanning)} aria-checked={formData.auto_replanning} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0 ${formData.auto_replanning ? 'bg-brand-primary' : 'bg-gray-300'}`} role="switch" type="button">
                    <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm ${formData.auto_replanning ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-brand-border rounded-lg p-6 shadow-none">
            <div className="pb-4 border-b border-brand-border mb-6">
              <h2 className="text-xl font-semibold text-brand-text">Notifications &amp; System Alerts</h2>
              <p className="text-sm text-brand-secondary mt-1">Establish thresholds for automated curriculum alerts, audit reports, and departmental feeds.</p>
            </div>
            <div className="divide-y divide-brand-border">
              <div className="py-4 flex items-center justify-between gap-3 first:pt-0">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Email alerts for attendance deficits</span>
                  <span className="text-sm text-brand-secondary">Notify when student attendance falls below autonomous threshold (&lt;75%) in CSE-A, CSE-C, or CSE-F.</span>
                </div>
                <button onClick={() => handleChange('notify_attendance', !formData.notify_attendance)} aria-checked={formData.notify_attendance} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0 ${formData.notify_attendance ? 'bg-brand-primary' : 'bg-gray-300'}`} role="switch" type="button">
                  <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm ${formData.notify_attendance ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              <div className="py-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Weekly summary reports</span>
                  <span className="text-sm text-brand-secondary">Deliver weekly syllabus execution, completed deliveries, and pace audit every Friday at 5:00 PM.</span>
                </div>
                <button onClick={() => handleChange('notify_weekly_report', !formData.notify_weekly_report)} aria-checked={formData.notify_weekly_report} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0 ${formData.notify_weekly_report ? 'bg-brand-primary' : 'bg-gray-300'}`} role="switch" type="button">
                  <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm ${formData.notify_weekly_report ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              <div className="py-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Lesson plan deviation alerts</span>
                  <span className="text-sm text-brand-secondary">Instant notification when an assigned section runs 1 or more sessions behind baseline syllabus schedule.</span>
                </div>
                <button onClick={() => handleChange('notify_lesson_deviation', !formData.notify_lesson_deviation)} aria-checked={formData.notify_lesson_deviation} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0 ${formData.notify_lesson_deviation ? 'bg-brand-primary' : 'bg-gray-300'}`} role="switch" type="button">
                  <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm ${formData.notify_lesson_deviation ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
              <div className="py-4 flex items-center justify-between gap-3 last:pb-0">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-brand-text block">Institutional announcements &amp; BOS updates</span>
                  <span className="text-sm text-brand-secondary">Academic council notices, syllabus revision drafts, and NAAC/NBA compliance deadlines.</span>
                </div>
                <button onClick={() => handleChange('notify_institutional', !formData.notify_institutional)} aria-checked={formData.notify_institutional} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center focus:outline-none flex-shrink-0 ${formData.notify_institutional ? 'bg-brand-primary' : 'bg-gray-300'}`} role="switch" type="button">
                  <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition duration-200 ease-in-out shadow-sm ${formData.notify_institutional ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-brand-border py-4 px-8 z-30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-brand-secondary">
            <span className="material-symbols-outlined text-brand-primary" style={{ fontSize: '1.1rem' }}>sync</span>
            <span>Last updated: {lastUpdated}</span>
            {saveMessage && <span className="ml-4 text-brand-primary font-medium">{saveMessage}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => {
              // Revert to faculty props
              if (faculty) {
                setFormData({
                  designation: faculty.designation || 'Professor',
                  academic_affiliation: faculty.academic_affiliation || 'Autonomous Board of Studies (BOS) Member',
                  default_academic_term: faculty.default_academic_term || 'CSE Sem I 2026–27 (Active)',
                  lesson_plan_granularity: faculty.lesson_plan_granularity || 'Daily Lecture-wise',
                  buffer_classes_allowance: faculty.buffer_classes_allowance ?? 2,
                  auto_replanning: faculty.auto_replanning ?? true,
                  notify_attendance: faculty.notify_attendance ?? true,
                  notify_weekly_report: faculty.notify_weekly_report ?? true,
                  notify_lesson_deviation: faculty.notify_lesson_deviation ?? true,
                  notify_institutional: faculty.notify_institutional ?? true,
                });
              }
            }} className="px-4 py-2 border border-brand-border rounded-lg text-sm font-medium text-brand-secondary hover:bg-brand-surface hover:text-brand-text transition-colors" type="button">
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-5 py-2 ${isSaving ? 'bg-blue-400' : 'bg-brand-primary hover:bg-blue-700'} text-white rounded-lg text-sm font-medium transition-colors shadow-none flex items-center gap-1.5`} 
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>save</span>
              <span>{isSaving ? 'Saving...' : 'Save Configurations'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
