import React, { useState, useEffect } from 'react';
import { createEvents } from 'ics';
import { Download, Save, X, Trash2, Calendar as CalendarIcon, Info } from 'lucide-react';

export default function ReviewModal({ data, isOpen, onClose, darkMode }) {
  // Sync local state with props when data changes
  const [editedData, setEditedData] = useState(data);

  useEffect(() => {
    if (data) setEditedData(data);
  }, [data]);

  if (!isOpen || !editedData) return null;

  // --- Logic Handlers ---

  const handleInputChange = (index, field, value) => {
    const updatedDeadlines = [...editedData.deadlines];
    updatedDeadlines[index][field] = value;
    setEditedData({ ...editedData, deadlines: updatedDeadlines });
  };

  const handleHeaderChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const removeDeadline = (index) => {
    const updatedDeadlines = editedData.deadlines.filter((_, i) => i !== index);
    setEditedData({ ...editedData, deadlines: updatedDeadlines });
  };

  const downloadICS = () => {
    // Filter out any entries without a valid date to prevent ics-library crashes
    const validEvents = editedData.deadlines.filter(d => d.due_date && d.due_date.includes('-'));

    const events = validEvents.map(d => {
      const [year, month, day] = d.due_date.split('-').map(Number);
      return {
        title: `[${editedData.course_code}] ${d.title}`,
        description: d.description || 'Extracted via SyllabiXtract',
        start: [year, month, day, 12, 0], // Default to 12:00 PM
        duration: { hours: 1 }
      };
    });

    createEvents(events, (error, value) => {
      if (error) {
        console.error("ICS Generation Error:", error);
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${editedData.course_code || 'Syllabus'}_Schedule.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // --- Dynamic Styling ---
  const bgPanel = darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const bgRow = darkMode ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-800';
  const inputBase = "bg-transparent border-none outline-none focus:ring-2 ring-blue-500/50 rounded-lg transition-all p-2 w-full";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl border-2 flex flex-col transition-colors duration-300 ${bgPanel}`}>
        
        {/* Header Section */}
        <div className={`p-8 border-b flex justify-between items-start ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <CalendarIcon size={24} />
              </div>
              <input 
                className={`text-3xl font-black tracking-tighter ${inputBase} ${textPrimary} !p-0`}
                value={editedData.course_code}
                placeholder="Course Code"
                onChange={(e) => handleHeaderChange('course_code', e.target.value)}
              />
            </div>
            <input 
              className={`text-lg font-bold text-blue-500 ${inputBase} !p-0`}
              value={editedData.course_name}
              placeholder="Course Name"
              onChange={(e) => handleHeaderChange('course_name', e.target.value)}
            />
          </div>
          <button onClick={onClose} className="p-3 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-full transition-all">
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Event List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-3">
          <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-5">Event Title</div>
            <div className="col-span-3">Due Date</div>
            <div className="col-span-3">Notes</div>
            <div className="col-span-1"></div>
          </div>

          {editedData.deadlines.map((deadline, idx) => (
            <div key={idx} className={`group p-2 rounded-2xl border flex gap-4 items-center transition-all ${bgRow}`}>
              <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <input 
                    className={`${inputBase} font-bold ${textPrimary}`}
                    value={deadline.title}
                    onChange={(e) => handleInputChange(idx, 'title', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <input 
                    type="date"
                    className={`${inputBase} font-mono text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
                    value={deadline.due_date}
                    onChange={(e) => handleInputChange(idx, 'due_date', e.target.value)}
                  />
                </div>
                <div className="col-span-4">
                  <input 
                    className={`${inputBase} text-sm italic ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                    value={deadline.description}
                    placeholder="Add notes..."
                    onChange={(e) => handleInputChange(idx, 'description', e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={() => removeDeadline(idx)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-3 transition-all"
                title="Remove Entry"
              >
                <Trash2 size={20}/>
              </button>
            </div>
          ))}

          {editedData.deadlines.length === 0 && (
            <div className="text-center py-20">
              <Info className="mx-auto mb-4 text-slate-500" size={48} />
              <p className="text-slate-500 font-medium">No deadlines extracted. Try adding one manually!</p>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className={`p-8 border-t flex flex-wrap gap-4 justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
          <p className="text-sm font-medium text-slate-500">
            {editedData.deadlines.length} events identified by AI.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={downloadICS} 
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-7 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Download size={22} /> Download .ics
            </button>
            <button 
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Save size={22} /> Save to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}