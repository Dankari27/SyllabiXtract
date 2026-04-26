import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, isSameMonth } from 'date-fns';
import { Maximize2, X, ChevronLeft, ChevronRight, Save, Download, Trash2, Calendar as CalIcon } from 'lucide-react';
import { createEvents } from 'ics';

export default function SyllabusCalendar({ data, darkMode }) {
  const [editedData, setEditedData] = useState(data);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Editing State
  const [editingIndex, setEditingIndex] = useState(null);

  // Sync data on initial load and set the calendar to the month of the first event
  useEffect(() => {
    if (data) {
      setEditedData(data);
      if (data.deadlines && data.deadlines.length > 0 && data.deadlines[0].due_date) {
        setCurrentDate(parseISO(data.deadlines[0].due_date));
      }
    }
  }, [data]);

  if (!editedData) return null;

  // --- Logic Handlers ---
  const handleInputChange = (field, value) => {
    const updatedDeadlines = [...editedData.deadlines];
    updatedDeadlines[editingIndex][field] = value;
    setEditedData({ ...editedData, deadlines: updatedDeadlines });
  };

  const removeDeadline = () => {
    const updatedDeadlines = editedData.deadlines.filter((_, i) => i !== editingIndex);
    setEditedData({ ...editedData, deadlines: updatedDeadlines });
    setEditingIndex(null);
  };

  const downloadICS = () => {
    const validEvents = (editedData.deadlines || []).filter(d => d.due_date && d.due_date.includes('-'));
    const events = validEvents.map(d => {
      const [year, month, day] = d.due_date.split('-').map(Number);
      return {
        title: `[${editedData.course_code || 'CLASS'}] ${d.title}`,
        description: d.description || '',
        start: [year, month, day, 12, 0],
        duration: { hours: 1 }
      };
    });

    createEvents(events, (error, value) => {
      if (error) return console.error(error);
      const blob = new Blob([value], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${editedData.course_code || 'Schedule'}.ics`;
      link.click();
    });
  };

  // --- Calendar Math ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Map events to their specific dates for easy lookup
  const eventsByDate = {};
  (editedData.deadlines || []).forEach((event, index) => {
    if (event.due_date) {
      if (!eventsByDate[event.due_date]) eventsByDate[event.due_date] = [];
      eventsByDate[event.due_date].push({ ...event, originalIndex: index });
    }
  });

  // --- Theming ---
  const textMain = darkMode ? 'text-white' : 'text-slate-800';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const bgCard = darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const bgDay = darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200';
  const bgDayNotMonth = darkMode ? 'bg-slate-800/20 text-slate-600' : 'bg-slate-100/50 text-slate-400';

  // VIEW 1: THE MINI PREVIEW
  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className={`w-full max-w-2xl mt-8 rounded-3xl border shadow-xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl overflow-hidden group ${bgCard}`}
      >
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-800/50' : 'bg-slate-50'}`}>
          <div>
            <h3 className={`font-black flex items-center gap-2 ${textMain}`}>
              <CalIcon size={18} className="text-blue-500" />
              {editedData.course_code} Schedule Preview
            </h3>
            <p className={`text-xs ${textMuted}`}>{editedData.deadlines?.length || 0} Events Extracted</p>
          </div>
          <div className="bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={16} />
          </div>
        </div>
        
        {/* Mini Grid */}
        <div className="p-4 bg-transparent pointer-events-none">
          <div className="text-center font-bold mb-2 text-sm text-blue-500">{format(currentDate, 'MMMM yyyy')}</div>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className={`text-center text-xs font-bold mb-1 ${textMuted}`}>{day}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hasEvents = eventsByDate[dateStr]?.length > 0;
              return (
                <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-xs border
                  ${isSameMonth(day, monthStart) ? (darkMode ? 'text-slate-300 border-slate-700/50' : 'text-slate-700 border-slate-100') : 'text-transparent border-transparent'}
                  ${hasEvents ? 'bg-blue-500/20 text-blue-500 font-bold border-blue-500/30' : ''}
                `}>
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: THE FULL CALENDAR MODAL
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-6xl h-[90vh] flex flex-col rounded-[2rem] shadow-2xl border-2 overflow-hidden ${bgCard}`}>
        
        {/* Modal Header */}
        <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h2 className={`text-2xl font-black ${textMain}`}>{editedData.course_code}</h2>
            <p className={`font-medium ${textMuted}`}>{editedData.course_name}</p>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className={`p-2 rounded-full hover:bg-slate-500/20 transition-colors ${textMain}`}>
              <ChevronLeft size={24} />
            </button>
            <h2 className={`text-2xl font-bold w-48 text-center ${textMain}`}>
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className={`p-2 rounded-full hover:bg-slate-500/20 transition-colors ${textMain}`}>
              <ChevronRight size={24} />
            </button>
          </div>

          <button onClick={() => setIsExpanded(false)} className={`p-3 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-full transition-all`}>
            <X size={28} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
          <div className="grid grid-cols-7 gap-4 h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className={`text-center font-black uppercase tracking-widest text-xs mb-2 ${textMuted}`}>{day}</div>
            ))}
            
            {calendarDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[dateStr] || [];
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <div key={i} className={`min-h-[120px] rounded-2xl border p-2 flex flex-col transition-colors
                  ${isCurrentMonth ? bgDay : bgDayNotMonth}
                  ${dayEvents.length > 0 ? (darkMode ? 'ring-1 ring-blue-500/30' : 'ring-1 ring-blue-400') : ''}
                `}>
                  <div className={`text-right text-sm font-bold mb-2 ${isCurrentMonth ? textMain : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Event Badges */}
                  <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                    {dayEvents.map((evt, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setEditingIndex(evt.originalIndex)}
                        className={`text-xs font-bold p-2 rounded-lg cursor-pointer truncate transition-all hover:scale-[1.02]
                          ${darkMode ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                        `}
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Event Popover/Dialog */}
        {editingIndex !== null && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl border animate-in zoom-in-95 duration-200 ${bgCard}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-black ${textMain}`}>Edit Event</h3>
                <button onClick={() => setEditingIndex(null)} className="text-slate-400 hover:text-slate-200"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${textMuted}`}>Title</label>
                  <input 
                    className={`w-full p-3 rounded-xl border font-bold outline-none focus:ring-2 ring-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    value={editedData.deadlines[editingIndex].title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${textMuted}`}>Date</label>
                  <input 
                    type="date"
                    className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ring-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white [color-scheme:dark]' : 'bg-slate-50 border-slate-200'}`}
                    value={editedData.deadlines[editingIndex].due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${textMuted}`}>Notes</label>
                  <textarea 
                    className={`w-full p-3 rounded-xl border outline-none focus:ring-2 ring-blue-500 h-24 resize-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    value={editedData.deadlines[editingIndex].description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-slate-700/50">
                <button onClick={removeDeadline} className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors">
                  <Trash2 size={18} /> Delete
                </button>
                <button onClick={() => setEditingIndex(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-transform active:scale-95">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className={`p-6 border-t flex flex-wrap gap-4 justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
          <p className={`text-sm font-medium ${textMuted}`}>
            Click any event badge in the calendar to edit its details.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={downloadICS} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg
                ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}
              `}
            >
              <Download size={20} /> Export .ics
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
              <Save size={20} /> Save Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}