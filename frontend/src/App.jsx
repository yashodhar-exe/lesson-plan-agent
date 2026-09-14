import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
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
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Sync the Supabase user with our backend
    if (session) {
      const user = session.user;
      fetch('http://localhost:8000/api/faculty/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0]
        })
      })
        .then(res => res.json())
        .then(data => {
          setFaculty(data);
        })
        .catch(err => console.error('Error syncing faculty:', err));
    }
  }, [session]);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text selection:bg-brand-light selection:text-brand-primary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Header faculty={faculty} session={session} />
        
        <main className="flex-1 p-10">
          <div className="max-w-6xl mx-auto">
            {currentView === 'dashboard' && <Dashboard facultyId={faculty?.id} faculty={faculty} setCurrentView={setCurrentView} />}
            {currentView === 'my-courses' && <CourseSetup facultyId={faculty?.id} faculty={faculty} setCurrentView={setCurrentView} />}
            {currentView === 'lesson-plans' && <LessonPlans facultyId={faculty?.id} setCurrentView={setCurrentView} />}
            {currentView === 'calendar' && <Calendar facultyId={faculty?.id} />}
            {currentView === 'progress' && <Progress />}
            {currentView === 'reports' && <Reports />}
            {currentView === 'settings' && <Settings faculty={faculty} session={session} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
