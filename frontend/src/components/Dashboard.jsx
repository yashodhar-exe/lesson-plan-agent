import React, { useState, useEffect } from 'react';
import NextClass from './NextClass';
import CourseList from './CourseList';

const Dashboard = ({ facultyId, faculty, setCurrentView }) => {
  const [workload, setWorkload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!facultyId) return;
      try {
        setLoading(true);
        const workloadRes = await fetch(`https://lesson-plan-agent.onrender.com/api/faculty/${facultyId}/workload`);
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
        <h1 className="text-3xl font-semibold tracking-tight text-brand-text mb-1.5">Hello, {faculty?.name || "Faculty"}</h1>
        <p className="text-base text-brand-secondary mt-1">Welcome back. Here's your teaching schedule and progress at a glance.</p>
      </div>

      {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-brand-secondary">
            <l-chaotic-orbit size="35" speed="1.5" color="#1e40af"></l-chaotic-orbit>
          </div>
      ) : error ? (
        <div className="bg-brand-alert/10 text-brand-alert p-4 rounded text-sm border border-brand-alert/20">
          Error loading data: {error}. Make sure the backend is running on https://lesson-plan-agent.onrender.com.
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-start">
          <div className="w-full">
            <NextClass nextClass={workload?.next_class} setCurrentView={setCurrentView} />
            <CourseList sections={workload?.sections} />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
