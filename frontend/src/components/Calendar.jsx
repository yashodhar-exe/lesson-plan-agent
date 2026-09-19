import React, { useState, useEffect } from 'react';

const Calendar = ({ facultyId }) => {
  const [sessions, setSessions] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Generate current week dates
  const getWeekDates = (offset) => {
    const curr = new Date();
    // Adjust by offset weeks
    curr.setDate(curr.getDate() + (offset * 7));
    const first = curr.getDate() - curr.getDay() + 1; // First day is Monday
    return Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(curr.setDate(first + i));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return {
        name: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateStr: `${year}-${month}-${d}`,
        dayIndex: i + 1
      };
    });
  };
  
  const days = getWeekDates(weekOffset);

  const timeSlots = [
    { period: 1, label: "09:00", ampm: "AM", range: "09:00 - 09:50" },
    { period: 2, label: "10:00", ampm: "AM", range: "10:00 - 10:50" },
    { period: 3, label: "11:00", ampm: "AM", range: "11:00 - 11:50" },
    { period: 4, label: "12:00", ampm: "PM", range: "12:00 - 12:50" },
    { period: 5, label: "01:00", ampm: "PM", range: "01:00 - 01:50" },
    { period: 6, label: "02:00", ampm: "PM", range: "02:00 - 02:50" },
    { period: 7, label: "03:00", ampm: "PM", range: "03:00 - 03:50" }
  ];

  useEffect(() => {
    if (!facultyId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/calendar/2026-27-1`)
      .then(res => res.json())
      .then(data => {
         const hols = data.filter(e => e.event_type === "HOLIDAY").map(e => {
            return e.date ? e.date.split("T")[0] : "";
         });
         setHolidays(hols);
      })
      .catch(e => console.error(e));
    
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/workload`)
      .then(res => res.json())
      .then(async (workload) => {
         const sections = workload.sections || [];
         let allSessions = [];
         
         for (const sec of sections) {
             try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lesson-plans/search?course_id=${sec.course_id}&section_id=${sec.section_id}`);
                const data = await res.json();
                if (data && data.sessions) {
                    const mapped = data.sessions.map(s => {
                        let d = new Date(s.date);
                        return {
                          ...s,
                          course_id: sec.course_id,
                          course_name: sec.course_name,
                          section_id: sec.section_id,
                          dayIndex: d.getDay() // 1 = Mon, 5 = Fri
                        };
                    });
                    allSessions = [...allSessions, ...mapped];
                }
             } catch (e) { console.error(e); }
         }
         
         setSessions(allSessions);
         setLoading(false);
      })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  const EmptyCell = ({ children, customClass = "" }) => (
    <div className={`p-2 border-r border-b border-brand-border/30 bg-white group hover:bg-brand-surface/30 transition-colors flex items-center justify-center ${customClass}`}>
      <div className="h-full w-full rounded-md border border-transparent group-hover:border-brand-primary/20 flex flex-col items-center justify-center text-brand-muted/0 group-hover:text-brand-primary/60 transition-all cursor-pointer bg-transparent">
         {children || <span className="material-symbols-outlined text-xl transition-transform transform group-hover:scale-110">add</span>}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg flex flex-col h-full min-h-[calc(100vh-3.5rem)] custom-scrollbar relative pb-12">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-light/20 to-transparent pointer-events-none -z-10" />

      <div className="px-8 pt-4 pb-8 max-w-7xl mx-auto w-full space-y-6 z-10">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-brand-text tracking-tight">Schedule</h1>
          </div>
          <p className="text-sm text-brand-secondary mt-1">Manage your weekly instructional timetable and track your upcoming classes.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-brand-border/30">
            <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-2 hover:bg-brand-surface rounded-lg text-brand-secondary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div className="text-sm font-semibold text-brand-text w-48 text-center">
              {weekOffset === 0 ? "This Week" : weekOffset === 1 ? "Next Week" : weekOffset === -1 ? "Last Week" : `${Math.abs(weekOffset)} Weeks ${weekOffset > 0 ? 'Ahead' : 'Ago'}`}
            </div>
            <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-2 hover:bg-brand-surface rounded-lg text-brand-secondary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-xl shadow-brand-border/10 border border-brand-border/30 overflow-hidden backdrop-blur-xl">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-brand-border/30 bg-brand-bg/50">
              <div className="p-4 border-r border-brand-border/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-brand-muted text-[20px]">schedule</span>
              </div>
              {days.map((day, idx) => (
                <div key={idx} className={`p-4 ${idx !== 5 ? 'border-r border-brand-border/30' : ''} text-center flex flex-col items-center justify-center group`}>
                  <span className="text-xs font-bold text-brand-muted uppercase tracking-wider group-hover:text-brand-primary transition-colors">{day.name}</span>
                  <span className="text-lg font-black text-brand-text mt-1">{day.date}</span>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4 text-brand-secondary">
                <l-chaotic-orbit size="35" speed="1.5" color="#1e40af"></l-chaotic-orbit>
              </div>
            ) : sessions.length === 0 ? (
               <div className="p-8 text-center text-brand-secondary">No sessions scheduled for this week. Set up a course to populate your calendar.</div>
            ) : (
              timeSlots.map((slot) => {
                 return (
                   <div key={slot.period} className="grid grid-cols-[100px_repeat(6,1fr)] h-32 group/row">
                     <div className="p-3 border-r border-b border-brand-border/30 bg-brand-bg/30 text-center flex flex-col items-center justify-center">
                       <span className="text-sm font-bold text-brand-text">{slot.label}</span>
                       <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mt-1">{slot.ampm}</span>
                     </div>
                     
                     {days.map((day, idx) => {
                        const sessionMatch = sessions.find(s => s.period === slot.period && s.date === day.dateStr);
                        const isLastDay = idx === 5;
                        const borderClasses = isLastDay ? 'border-b border-brand-border/30' : 'border-r border-b border-brand-border/30';
                        const isHoliday = holidays.includes(day.dateStr);

                        if (isHoliday) {
                           return (
                             <div key={idx} className={`p-2 ${borderClasses} bg-brand-surface/20 flex flex-col items-center justify-center opacity-70 border-dashed`}>
                               <span className="material-symbols-outlined text-brand-muted mb-1">celebration</span>
                               <span className="text-[10px] font-bold text-brand-muted tracking-wider">HOLIDAY</span>
                             </div>
                           );
                        }

                        if (!sessionMatch) {
                           return <EmptyCell key={idx} customClass={borderClasses} />;
                        }

                        const isCompleted = sessionMatch.status === 'COMPLETED';
                        
                        return (
                          <div key={idx} className={`p-2 ${borderClasses} bg-white`}>
                            <div className={`h-full rounded-xl ${isCompleted ? 'bg-green-50' : 'bg-white shadow-sm'} p-3 flex flex-col hover:bg-brand-surface/50 transition-colors relative overflow-hidden group/card cursor-pointer`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold py-0.5 ${isCompleted ? 'text-green-700' : 'text-brand-primary'}`}>
                                  {sessionMatch.course_id} - {sessionMatch.section_id}
                                </span>
                                {isCompleted && <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>}
                              </div>
                              <div className={`font-bold text-sm leading-tight mt-1 transition-colors ${isCompleted ? 'text-green-900' : 'text-brand-text group-hover/card:text-brand-primary'}`}>
                                {sessionMatch.course_name}
                              </div>
                              <span className="mt-1 text-[10px] font-medium text-brand-secondary/80">{slot.range}</span>
                              <div className="mt-auto pt-2 text-[10px] text-brand-secondary truncate" title={sessionMatch.topic_name}>
                                {sessionMatch.topic_name || 'No Topic'}
                              </div>
                            </div>
                          </div>
                        );
                     })}
                   </div>
                 );
              })
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
