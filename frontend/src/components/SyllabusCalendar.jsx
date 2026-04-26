import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, isSameMonth } from 'date-fns';
import { Maximize2, X, ChevronLeft, ChevronRight, Save, Download, Trash2, Calendar as CalIcon, GripVertical } from 'lucide-react';
import { createEvents } from 'ics';

export default function SyllabusCalendar({ data, darkMode }) {
  const [editedData, setEditedData] = useState(data);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Editing & Dragging State
  const [editingIndex, setEditingIndex] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  // Sync data on initial load
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

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, originalIndex) => {
    setDraggedIdx(originalIndex);
    // Makes the drag image slightly transparent
    e.dataTransfer.effectAllowed = "move"; 
  };

  const handleDragOver = (e, dateStr) => {
    e.preventDefault(); // Necessary to allow dropping
    if (dragOverDate !== dateStr) {
      setDragOverDate(dateStr);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverDate(null);
  };

  const handleDrop = (e, targetDateStr) => {
    e.preventDefault();
    setDragOverDate(null);
    
    if (draggedIdx === null) return;

    // Update the date of the dragged event
    const updatedDeadlines = [...editedData.deadlines];
    updatedDeadlines[draggedIdx].due_date = targetDateStr;
    setEditedData({ ...editedData, deadlines: updatedDeadlines });
    setDraggedIdx(null);
  };

  // --- Export ---
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

  const eventsByDate = {};
  (editedData.deadlines || []).forEach((event, index) => {
    if (event.due_date) {
      if (!eventsByDate[event.due_date]) eventsByDate[event.due_date] = [];
      eventsByDate[event.due_date].push({ ...event, originalIndex: index });
    }
  });

  // --- Theming & Artistic Touches ---
  const textMain = darkMode ? 'text-white' : 'text-slate-800';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';
  
  // Differentiating the calendar background from the main app background
  const bgCard = darkMode ? 'bg-slate-800 border-slate-700 shadow-slate-900/50' : 'bg-white border-slate-200 shadow-slate-200/50';
  const bgDay = darkMode ? 'bg-slate-800/80 hover:bg-slate-700/50' : 'bg-white hover:bg-slate-50';
  const bgDayNotMonth = darkMode ? 'bg-slate-900/50 text-slate-600' : 'bg-slate-100/50 text-slate-400';
  
  // Custom modern scrollbar classes via Tailwind arbitrary values
  const scrollbarClasses = `
    [&::-webkit-scrollbar]:w-1.5 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    ${darkMode ? '[&::-webkit-scrollbar-thumb]:bg-slate-600' : '[&::-webkit-scrollbar-thumb]:bg-slate-300'}
  `;

  // VIEW 1: THE MINI PREVIEW
  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className={`w-full max-w-2xl mt-8 rounded-3xl border shadow-xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl overflow-hidden group ${bgCard}`}
      >
        <div className={`p-4 border-b flex justify-between items-center bg-gradient-to-r ${darkMode ? 'from-blue-900/40 to-slate-800 border-slate-700' : 'from-blue-50 to-white border-slate-100'}`}>
          <div>
            <h3 className={`font-black flex items-center gap-2 ${textMain}`}>
              <CalIcon size={18} className="text-blue-500" />
              {editedData.course_code} Schedule Preview
            </h3>
            <p className={`text-xs font-medium ${textMuted}`}>{editedData.deadlines?.length || 0} Events Extracted</p>
          </div>
          <div className="bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            <Maximize2 size={16} />
          </div>
        </div>
        
        <div className="p-4 pointer-events-none">
          <div className="text-center font-black tracking-tight mb-3 text-blue-500">{format(currentDate, 'MMMM yyyy')}</div>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className={`text-center text-xs font-bold mb-1 ${textMuted}`}>{day}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hasEvents = eventsByDate[dateStr]?.length > 0;
              return (
                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                  ${isSameMonth(day, monthStart) ? (darkMode ? 'text-slate-300' : 'text-slate-700') : 'text-transparent'}
                  ${hasEvents ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30 font-bold scale-110' : ''}
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-6xl h-[90vh] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-white/10 ${bgCard}`}>
        
        {/* Artistic Header with Gradient */}
        <div className={`p-6 border-b flex justify-between items-center relative overflow-hidden ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${darkMode ? 'from-blue-600 to-purple-600' : 'from-blue-400 to-purple-400'}`}></div>
          
          <div className="relative z-10">
            <h2 className={`text-3xl font-black tracking-tight ${textMain}`}>{editedData.course_code}</h2>
            <p className={`font-medium text-blue-500`}>{editedData.course_name}</p>
          </div>

          <div className="flex items-center gap-6 relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl ring-1 ring-white/20 shadow-sm">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className={`p-1 rounded-full hover:bg-slate-500/20 transition-colors ${textMain}`}>
              <ChevronLeft size={24} />
            </button>
            <h2 className={`text-xl font-black w-40 text-center tracking-tight ${textMain}`}>
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className={`p-1 rounded-full hover:bg-slate-500/20 transition-colors ${textMain}`}>
              <ChevronRight size={24} />
            </button>
          </div>

          <button onClick={() => setIsExpanded(false)} className={`relative z-10 p-3 bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all shadow-sm`}>
            <X size={24} />
          </button>
        </div>

        {/* Calendar Grid Background styling to separate from page */}
        <div className={`flex-1 overflow-y-auto p-6 ${darkMode ? 'bg-slate-900/60' : 'bg-slate-50/80'}`}>
          <div className="grid grid-cols-7 gap-3 h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className={`text-center font-black uppercase tracking-widest text-xs mb-1 ${textMuted}`}>{day}</div>
            ))}
            
            {calendarDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[dateStr] || [];
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());
              const isDragTarget = dragOverDate === dateStr;

              return (
                <div 
                  key={i} 
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  className={`min-h-[120px] rounded-2xl border flex flex-col transition-all duration-200 overflow-hidden
                    ${isCurrentMonth ? bgDay : bgDayNotMonth}
                    ${darkMode ? 'border-slate-700/60' : 'border-slate-200'}
                    ${isToday ? 'ring-2 ring-blue-500 shadow-md shadow-blue-500/20' : ''}
                    ${isDragTarget ? 'ring-2 ring-purple-500 bg-purple-500/10 scale-[1.02]' : ''}
                  `}
                >
                  <div className={`text-right text-sm font-black p-2 mb-1 
                    ${isCurrentMonth ? textMain : ''} 
                    ${isToday ? 'text-blue-500' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Event Badges Container with custom scrollbar */}
                  <div className={`flex-1 space-y-1.5 overflow-y-auto p-2 pt-0 ${scrollbarClasses}`}>
                    {dayEvents.map((evt, idx) => (
                      <div 
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, evt.originalIndex)}
                        onClick={() => setEditingIndex(evt.originalIndex)}
                        className={`group relative text-xs font-bold p-2.5 rounded-xl cursor-grab active:cursor-grabbing border-l-4 transition-all hover:scale-[1.02] shadow-sm
                          ${darkMode 
                            ? 'bg-slate-800 border-l-blue-500 text-slate-200 hover:bg-slate-700 ring-1 ring-white/5' 
                            : 'bg-white border-l-blue-500 text-slate-700 hover:bg-blue-50 ring-1 ring-slate-200/50'
                          }
                        `}
                        title={evt.title}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="truncate pr-4">{evt.title}</span>
                          <GripVertical size={14} className="opacity-0 group-hover:opacity-100 text-slate-400 absolute right-1.5 top-2.5 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit Event Popover */}
        {editingIndex !== null && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-md p-6 rounded-[2rem] shadow-2xl border ring-1 ring-white/10 animate-in zoom-in-95 duration-200 ${bgCard}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-black ${textMain}`}>Edit Event</h3>
                <button onClick={() => setEditingIndex(null)} className="p-2 hover:bg-slate-500/20 rounded-full transition-colors text-slate-400"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${textMuted}`}>Title</label>
                  <input 
                    className={`w-full p-3 rounded-xl border-2 outline-none transition-all focus:border-blue-500 focus:ring-4 ring-blue-500/20 font-bold ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    value={editedData.deadlines[editingIndex].title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${textMuted}`}>Date</label>
                  <input 
                    type="date"
                    className={`w-full p-3 rounded-xl border-2 outline-none transition-all focus:border-blue-500 focus:ring-4 ring-blue-500/20 font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-white [color-scheme:dark]' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    value={editedData.deadlines[editingIndex].due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1 uppercase tracking-wider ${textMuted}`}>Notes</label>
                  <textarea 
                    className={`w-full p-3 rounded-xl border-2 outline-none transition-all focus:border-blue-500 focus:ring-4 ring-blue-500/20 h-28 resize-none custom-scrollbar ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    value={editedData.deadlines[editingIndex].description}
                    placeholder="Add specific details or links..."
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={removeDeadline} className="flex items-center gap-2 text-red-500 hover:text-white font-bold px-4 py-3 rounded-xl hover:bg-red-500 transition-all border border-red-500/30">
                  <Trash2 size={18} /> Delete
                </button>
                <button onClick={() => setEditingIndex(null)} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
                  Done Editing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className={`p-6 border-t flex flex-wrap gap-4 justify-between items-center ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-white/80'}`}>
          <p className={`text-sm font-medium flex items-center gap-2 ${textMuted}`}>
            <GripVertical size={16} className="text-blue-500" />
            Drag and drop events to reschedule them.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={downloadICS} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-md
                ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}
              `}
            >
              <Download size={20} /> Export .ics
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
              <Save size={20} /> Save Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}