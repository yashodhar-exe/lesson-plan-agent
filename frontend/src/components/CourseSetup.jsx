import React, { useState } from 'react';

const CourseSetup = ({ facultyId, faculty, setCurrentView }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    academicYear: '',
    semesterCycle: '',
    department: '',
    instructor: faculty?.name || '',
  });

  const [sections, setSections] = useState(
    Array.from({ length: 22 }, (_, i) => `CSE-${i + 1}`).reduce((acc, sec) => {
      acc[sec] = false;
      return acc;
    }, {})
  );

  const [files, setFiles] = useState({
    calendar: null,
    timetable: null,
    syllabus: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedSections = Object.keys(sections).filter(s => sections[s]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const selectedSections = Object.keys(sections).filter(s => sections[s]);
      if (selectedSections.length === 0) {
        throw new Error("Please select at least one section.");
      }
      if (!files.calendar || !files.timetable || !files.syllabus) {
        throw new Error("Please upload Calendar, Timetable, and Syllabus PDFs.");
      }
      if (!formData.courseName || !formData.courseCode || !formData.department || !formData.instructor) {
        throw new Error("Please fill out all course details.");
      }

      const payload = new FormData();
      payload.append('course_name', formData.courseName);
      payload.append('course_code', formData.courseCode);
      payload.append('academic_year', formData.academicYear);
      payload.append('semester_cycle', formData.semesterCycle);
      payload.append('department', formData.department);
      payload.append('instructor', formData.instructor);
      if (facultyId) {
        payload.append('faculty_id', facultyId);
      }
      payload.append('sections', JSON.stringify(selectedSections));

      payload.append('calendar_file', files.calendar);
      payload.append('timetable_file', files.timetable);
      payload.append('syllabus_file', files.syllabus);

      const response = await fetch('https://lesson-plan-agent.onrender.com/api/setup-course', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to setup course');
      }

      setSuccess("Course setup successfully! Lesson plans have been generated.");
      if (setCurrentView) {
        setTimeout(() => setCurrentView('lesson-plans'), 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex-1 flex flex-col w-full pb-32">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-text mb-1.5">Course & Academic Setup</h1>
          <p className="text-base text-brand-secondary mt-1">Configure your course details, sections, and upload academic documents.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {success}
          </div>
        )}
        
        <div className="flex flex-col gap-10">
        {/* Section 1: Course Details */}
        <section className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-brand-text tracking-tight">1. Course Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="group">
              <label className="block text-[10px] font-bold text-brand-secondary mb-2 uppercase tracking-wider">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="w-full h-11 px-0 border-0 border-b border-brand-border bg-transparent text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary focus:ring-0 transition-all placeholder:text-brand-muted/70 placeholder:font-normal"
                placeholder="e.g. Database Management Systems"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold text-brand-secondary mb-2 uppercase tracking-wider">Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="w-full h-11 px-0 border-0 border-b border-brand-border bg-transparent text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary focus:ring-0 transition-all placeholder:text-brand-muted/70 placeholder:font-normal"
                placeholder="e.g. CS301"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold text-brand-secondary mb-2 uppercase tracking-wider">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="w-full h-11 px-0 border-0 border-b border-brand-border bg-transparent text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary focus:ring-0 transition-all placeholder:text-brand-muted/70 placeholder:font-normal"
                placeholder="e.g. 2026-27"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold text-brand-secondary mb-2 uppercase tracking-wider">Semester</label>
              <input
                type="text"
                name="semesterCycle"
                value={formData.semesterCycle}
                onChange={handleInputChange}
                className="w-full h-11 px-0 border-0 border-b border-brand-border bg-transparent text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary focus:ring-0 transition-all placeholder:text-brand-muted/70 placeholder:font-normal"
                placeholder="e.g. Semester I"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold text-brand-secondary mb-2 uppercase tracking-wider">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full h-11 px-0 border-0 border-b border-brand-border bg-transparent text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary focus:ring-0 transition-all placeholder:text-brand-muted/70 placeholder:font-normal"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold text-brand-secondary mb-2 uppercase tracking-wider">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full h-11 px-0 border-0 border-b border-brand-border bg-transparent text-sm font-medium text-brand-text focus:outline-none focus:border-brand-primary focus:ring-0 transition-all placeholder:text-brand-muted/70 placeholder:font-normal"
                placeholder="Instructor Name"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Sections Taught */}
        <section className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] relative">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-brand-text tracking-tight">2. Sections Taught</h2>
          </div>

          <div className="relative">
            <div 
              className="w-full min-h-11 px-3 py-2 border border-brand-border rounded-lg bg-white cursor-pointer flex items-center justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedSections.length === 0 ? (
                  <span className="text-brand-muted/70 text-sm py-1">Select sections...</span>
                ) : (
                  selectedSections.map(sec => (
                    <span key={sec} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                      {sec}
                      <span 
                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-brand-primary/80" 
                        onClick={(e) => { e.stopPropagation(); handleSectionChange(sec); }}
                      >
                        close
                      </span>
                    </span>
                  ))
                )}
              </div>
              <span className="material-symbols-outlined text-brand-muted">
                {dropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </div>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-brand-border rounded-lg shadow-lg z-10 p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.keys(sections).map((sec) => (
                    <label key={sec} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={sections[sec]}
                        onChange={() => handleSectionChange(sec)}
                        className="w-4 h-4 text-brand-primary border-brand-border rounded focus:ring-brand-primary/20 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-brand-secondary group-hover:text-brand-text transition-colors">
                        {sec}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Academic Documents */}
        <section className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-brand-text tracking-tight">3. Academic Documents</h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Calendar */}
            <div className="flex items-center justify-between p-4 border border-brand-border rounded-xl hover:border-brand-primary/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-primary">
                  <span className="material-symbols-outlined text-[20px]">event_note</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text">Academic Calendar</h4>
                  <p className="text-xs text-brand-secondary">Official semester dates & holidays</p>
                </div>
              </div>
              <div>
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${files.calendar ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-brand-surface text-brand-primary hover:bg-brand-primary/10'}`}>
                    {files.calendar ? (
                      <><span className="material-symbols-outlined text-[14px]">check_circle</span> {files.calendar.name}</>
                    ) : (
                      'Upload PDF'
                    )}
                  </div>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'calendar')} />
                </label>
              </div>
            </div>

            {/* Timetable */}
            <div className="flex items-center justify-between p-4 border border-brand-border rounded-xl hover:border-brand-primary/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-primary">
                  <span className="material-symbols-outlined text-[20px]">view_week</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text">Master Timetable</h4>
                  <p className="text-xs text-brand-secondary">Section schedules & periods</p>
                </div>
              </div>
              <div>
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${files.timetable ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-brand-surface text-brand-primary hover:bg-brand-primary/10'}`}>
                    {files.timetable ? (
                      <><span className="material-symbols-outlined text-[14px]">check_circle</span> {files.timetable.name}</>
                    ) : (
                      'Upload PDF'
                    )}
                  </div>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'timetable')} />
                </label>
              </div>
            </div>

            {/* Syllabus */}
            <div className="flex items-center justify-between p-4 border border-brand-border rounded-xl hover:border-brand-primary/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-primary">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text">Course Syllabus</h4>
                  <p className="text-xs text-brand-secondary">Units, topics & notional hours</p>
                </div>
              </div>
              <div>
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${files.syllabus ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-brand-surface text-brand-primary hover:bg-brand-primary/10'}`}>
                    {files.syllabus ? (
                      <><span className="material-symbols-outlined text-[14px]">check_circle</span> {files.syllabus.name}</>
                    ) : (
                      'Upload PDF'
                    )}
                  </div>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'syllabus')} />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-brand-secondary">
            <span className="material-symbols-outlined text-brand-primary" style={{ fontSize: '1.1rem' }}>info</span>
            <span>Ensure all details are correct before saving.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={isSubmitting}
              className="px-4 py-2 border border-brand-border rounded-lg text-sm font-medium text-brand-secondary hover:bg-brand-surface hover:text-brand-text transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-brand-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-none flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <l-chaotic-orbit size="20" speed="1.5" color="currentColor"></l-chaotic-orbit>
                  <span>Extracting AI Data (Takes ~1 min)...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>save</span>
                  <span>Save Course Setup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CourseSetup;
