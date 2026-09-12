import React, { useState, useEffect } from 'react';
import NextClass from './NextClass';
import CourseList from './CourseList';

const Dashboard = ({ facultyId, faculty }) => {
  const [workload, setWorkload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const workloadRes = await fetch(`http://localhost:8000/api/faculty/${facultyId}/workload`);
        if (!workloadRes.ok) throw new Error('Failed to fetch data from API');
        const workloadData = await workloadRes.json();
        setWorkload(workloadData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [facultyId]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-text mb-1.5">Hello, {faculty?.name || "Dr. Sharma"}</h1>
        <p className="text-base text-brand-secondary mt-1">Welcome back. Here's your teaching schedule and progress at a glance.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-brand-secondary text-sm">
          Loading dashboard data...
        </div>
      ) : error ? (
        <div className="bg-brand-alert/10 text-brand-alert p-4 rounded text-sm border border-brand-alert/20">
          Error loading data: {error}. Make sure the backend is running on http://localhost:8000.
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-start">
          <div className="w-full">
            <NextClass nextClass={workload?.next_class} />
            <CourseList sections={workload?.sections} />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
