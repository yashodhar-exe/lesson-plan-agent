import React, { useState, useEffect } from 'react';

const Reports = ({ facultyId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [planVsActual, setPlanVsActual] = useState(null);
  const [courseDelivery, setCourseDelivery] = useState(null);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (facultyId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/courses`)
        .then(res => res.json())
        .then(data => {
          setCourses(data);
          if (data.length > 0) {
            setSelectedCourse(data[0].id);
          }
        })
        .catch(err => console.error("Error fetching courses:", err));
    }
  }, [facultyId]);

  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/reports/plan-vs-actual/${selectedCourse}`).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_URL}/api/reports/course-delivery/${selectedCourse}`).then(res => res.json())
      ])
      .then(([planData, deliveryData]) => {
        setPlanVsActual(planData);
        setCourseDelivery(deliveryData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
    }
  }, [selectedCourse]);

  return (
    <div className="w-full h-full">
      <div className="flex-1 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-text tracking-tight">Academic Reports &amp; Analytics</h2>
            <p className="text-sm text-brand-secondary mt-1 max-w-3xl">
              Generate, download, and review institutional compliance reports, course delivery status, and variance analysis.
            </p>
          </div>
          {/* Context Filter Select */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                className="h-9 pl-3 pr-8 bg-white border border-brand-border rounded text-sm text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-surface appearance-none cursor-pointer"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[18px] text-brand-secondary absolute right-2 top-2.5 pointer-events-none">expand_more</span>
            </div>
          </div>
        </section>

        {/* Section: Report Generation Modules */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="text-xl font-semibold text-brand-text">Standard Institutional Reports</h3>
              <p className="text-sm text-brand-secondary mt-1">One-click automated export formatted to autonomous regulatory and NBA/NAAC audit criteria.</p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-brand-secondary text-sm">Processing Data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Card 1: Course Delivery Status */}
              <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Delivery</span>
                    <span className="material-symbols-outlined text-brand-secondary text-[20px]">timeline</span>
                  </div>
                  <h4 className="text-base font-semibold text-brand-text">Course Delivery Status</h4>
                  <p className="text-sm text-brand-secondary mt-1">
                    Status of lesson plan execution across sections.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    {courseDelivery?.section_reports ? (
                        courseDelivery.section_reports.map((sr, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-xs text-brand-secondary font-medium">
                            {sr.section_name}: {sr.status}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-brand-secondary">No data available</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Card 2: Variance Analysis */}
              <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Analysis</span>
                    <span className="material-symbols-outlined text-brand-secondary text-[20px]">analytics</span>
                  </div>
                  <h4 className="text-base font-semibold text-brand-text">Plan vs Actual Variance</h4>
                  <p className="text-sm text-brand-secondary mt-1">
                    Planned vs Actual teaching hours and variance tracking.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex flex-col gap-2">
                  <span className="text-xs text-brand-secondary font-medium">
                    Planned: {planVsActual?.total_planned_hours || 0} hrs
                  </span>
                  <span className="text-xs text-brand-secondary font-medium">
                    Actual: {planVsActual?.total_actual_hours || 0} hrs
                  </span>
                  <span className={`text-xs font-medium ${planVsActual?.variance > 0 ? 'text-red-600' : 'text-brand-secondary'}`}>
                    Variance: {planVsActual?.variance || 0} hrs
                  </span>
                </div>
              </div>

              {/* Card 3: Attendance Defaulters */}
              <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Attendance</span>
                    <span className="material-symbols-outlined text-brand-secondary text-[20px]">person_alert</span>
                  </div>
                  <h4 className="text-base font-semibold text-brand-text">Attendance Defaulters List</h4>
                  <p className="text-sm text-brand-secondary mt-1">
                    Students below 75% threshold across active cohorts.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                  <span className="text-xs text-brand-secondary font-medium">
                    14 flagged scholars
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1 border border-brand-primary text-brand-primary hover:bg-brand-surface rounded text-sm font-medium transition-colors" type="button">
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Card 4: CIE Marks Register */}
              <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Internal Evaluation (CIE)</span>
                    <span className="material-symbols-outlined text-brand-secondary text-[20px]">table_chart</span>
                  </div>
                  <h4 className="text-base font-semibold text-brand-text">CIE Marks Register</h4>
                  <p className="text-sm text-brand-secondary mt-1">
                    Consolidated Internal Assessment scores with mapped Course Outcome attainments.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                  <span className="text-xs text-brand-secondary font-medium">
                    2 of 5 CIE completed
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1 border border-brand-border text-brand-text hover:bg-brand-surface rounded text-sm font-medium transition-colors" type="button">
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Excel</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Reports;
