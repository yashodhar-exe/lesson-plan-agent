import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CourseSetup from './components/CourseSetup';
import LessonPlans from './components/LessonPlans';
import Calendar from './components/Calendar';
import Progress from './components/Progress';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Reports from './components/Reports';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const facultyId = 1;
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/faculty/${facultyId}`)
      .then(res => res.json())
      .then(data => setFaculty(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text selection:bg-brand-light selection:text-brand-primary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Header faculty={faculty} />
        
        <main className="flex-1 p-10">
          <div className="max-w-6xl mx-auto">
            {currentView === 'dashboard' && <Dashboard facultyId={facultyId} faculty={faculty} />}
            {currentView === 'my-courses' && <CourseSetup facultyId={facultyId} setCurrentView={setCurrentView} />}
            {currentView === 'lesson-plans' && <LessonPlans />}
            {currentView === 'calendar' && <Calendar />}
            {currentView === 'progress' && <Progress />}
            {currentView === 'reports' && <Reports />}
            {currentView === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
