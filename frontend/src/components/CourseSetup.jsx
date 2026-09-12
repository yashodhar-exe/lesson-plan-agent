import React, { useState } from 'react';

const CourseSetup = ({ facultyId, setCurrentView }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    academicYear: '',
    semesterCycle: '',
    department: '',
    instructor: '',
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
      payload.append('sections', JSON.stringify(selectedSections));

      payload.append('calendar_file', files.calendar);
      payload.append('timetable_file', files.timetable);
      payload.append('syllabus_file', files.syllabus);

      const response = await fetch('http://localhost:8000/api/setup-course', {
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
        
        <div className="flex flex-col gap-8">
        {/* Section 1: Course Details */}
        <section className="bg-white border border-brand-border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-text">1. Course Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <label className="block text-[11px] font-medium text-brand-secondary mb-1.5">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="w-full h-9 px-3 border border-brand-border/80 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted"
                placeholder="Database Management Systems"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-brand-secondary mb-1.5">Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="w-full h-9 px-3 border border-brand-border/80 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted"
                placeholder="CS301"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-brand-secondary mb-1.5">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="w-full h-9 px-3 border border-brand-border/80 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted"
                placeholder="2026-27"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-brand-secondary mb-1.5">Semester Cycle</label>
              <input
                type="text"
                name="semesterCycle"
                value={formData.semesterCycle}
                onChange={handleInputChange}
                className="w-full h-9 px-3 border border-brand-border/80 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted"
                placeholder="Semester I"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-brand-secondary mb-1.5">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full h-9 px-3 border border-brand-border/80 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted"
                placeholder="Computer Science & Engineering"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-brand-secondary mb-1.5">Instructor of Record</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full h-9 px-3 border border-brand-border/80 bg-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted"
                placeholder="Dr. A. R. Sharma"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Sections Taught */}
        <section className="bg-white border border-brand-border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-text">2. Sections Taught</h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {Object.keys(sections).map((sec) => (
              <label key={sec} className={`flex items-center justify-center px-4 py-1.5 rounded-full cursor-pointer select-none transition-all border text-sm font-medium ${sections[sec] ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm' : 'bg-white border-brand-border text-brand-secondary hover:border-brand-primary/40 hover:text-brand-text'}`}>
                {sec}
                <input
                  type="checkbox"
                  className="hidden"
                  checked={sections[sec]}
                  onChange={() => handleSectionChange(sec)}
                />
              </label>
            ))}
          </div>
        </section>

        {/* Section 3: Academic Documents */}
        <section className="bg-white border border-brand-border rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-text">3. Academic Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Calendar */}
            <div className="bg-white border border-brand-border p-5 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-3xl text-brand-muted mb-2">event_note</span>
              <h4 className="text-sm font-medium text-brand-text mb-1">Academic Calendar</h4>
              <p className="text-[10px] text-brand-muted mb-4">Official semester dates & holidays</p>

              <label className="cursor-pointer text-brand-primary hover:text-blue-700 text-[11px] font-medium px-4 py-1.5 transition-colors">
                {files.calendar ? files.calendar.name : 'Upload PDF'}
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'calendar')} />
              </label>
            </div>

            {/* Timetable */}
            <div className="bg-white border border-brand-border p-5 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-3xl text-brand-muted mb-2">view_week</span>
              <h4 className="text-sm font-medium text-brand-text mb-1">Master Timetable</h4>
              <p className="text-[10px] text-brand-muted mb-4">Section schedules & periods</p>

              <label className="cursor-pointer text-brand-primary hover:text-blue-700 text-[11px] font-medium px-4 py-1.5 transition-colors">
                {files.timetable ? files.timetable.name : 'Upload PDF'}
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'timetable')} />
              </label>
            </div>

            {/* Syllabus */}
            <div className="bg-white border border-brand-border p-5 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-3xl text-brand-muted mb-2">menu_book</span>
              <h4 className="text-sm font-medium text-brand-text mb-1">Course Syllabus</h4>
              <p className="text-[10px] text-brand-muted mb-4">Units, topics & notional hours</p>

              <label className="cursor-pointer text-brand-primary hover:text-blue-700 text-[11px] font-medium px-4 py-1.5 transition-colors">
                {files.syllabus ? files.syllabus.name : 'Upload PDF'}
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, 'syllabus')} />
              </label>
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
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '1.1rem' }}>sync</span>
                  <span>Processing...</span>
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
