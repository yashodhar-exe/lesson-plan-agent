import React from 'react';

const Reports = () => {
  return (
    <div className="w-full h-full">
      <div className="flex-1 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-text tracking-tight">Academic Reports &amp; Analytics</h2>
            <p className="text-sm text-brand-secondary mt-1 max-w-3xl">
              Generate, download, and review institutional compliance reports, attendance registers, and continuous evaluation records.
            </p>
          </div>
          {/* Context Filter Select */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="h-9 pl-3 pr-8 bg-white border border-brand-border rounded text-sm text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-surface appearance-none cursor-pointer">
                <option>All Assigned Courses (3)</option>
                <option>CS301 - Design &amp; Analysis of Algorithms</option>
                <option>CS408 - Distributed Systems</option>
                <option>CS304 - Database Engineering</option>
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
          {/* 4-Card Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Card 1: Attendance Defaulters */}
            <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Attendance</span>
                  <span className="material-symbols-outlined text-brand-secondary text-[20px]">person_alert</span>
                </div>
                <h4 className="text-base font-semibold text-brand-text">Attendance Defaulters List</h4>
                <p className="text-sm text-brand-secondary mt-1">
                  Students below 75% threshold across active cohorts CSE-A, CSE-C, CSE-F.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-xs text-brand-secondary font-medium">
                  14 flagged scholars
                </span>
                <button className="flex items-center gap-1 px-3 py-1 border border-brand-primary text-brand-primary hover:bg-brand-surface rounded text-sm font-medium transition-colors" type="button">
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>Generate PDF</span>
                </button>
              </div>
            </div>
            {/* Card 2: Syllabus Coverage */}
            <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">NBA / NAAC Accreditation</span>
                  <span className="material-symbols-outlined text-brand-secondary text-[20px]">fact_check</span>
                </div>
                <h4 className="text-base font-semibold text-brand-text">Syllabus Coverage Report</h4>
                <p className="text-sm text-brand-secondary mt-1">
                  Unit-wise completion status for NBA/NAAC criteria 2.2 &amp; 2.3 compliance.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-xs text-brand-secondary font-medium">
                  74% Autonomous progress
                </span>
                <button className="flex items-center gap-1 px-3 py-1 border border-brand-primary text-brand-primary hover:bg-brand-surface rounded text-sm font-medium transition-colors" type="button">
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>Generate PDF</span>
                </button>
              </div>
            </div>
            {/* Card 3: CIE Marks Register */}
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
                <span className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-xs text-brand-secondary font-medium">
                  2 of 5 CIE completed
                </span>
                <button className="flex items-center gap-1 px-3 py-1 border border-brand-border text-brand-text hover:bg-brand-surface rounded text-sm font-medium transition-colors" type="button">
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  <span>Export to Excel</span>
                </button>
              </div>
            </div>
            {/* Card 4: Faculty Workload */}
            <div className="bg-white border border-brand-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary transition-colors shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wider">Faculty Operations</span>
                  <span className="material-symbols-outlined text-brand-secondary text-[20px]">assignment_ind</span>
                </div>
                <h4 className="text-base font-semibold text-brand-text">Faculty Workload &amp; Logbook</h4>
                <p className="text-sm text-brand-secondary mt-1">
                  Complete session execution log, verified teaching periods, and pedagogical breakdown.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-xs text-brand-secondary font-medium">
                  48 / 90 hours logged
                </span>
                <button className="flex items-center gap-1 px-3 py-1 border border-brand-primary text-brand-primary hover:bg-brand-surface rounded text-sm font-medium transition-colors" type="button">
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>Generate PDF</span>
                </button>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default Reports;
