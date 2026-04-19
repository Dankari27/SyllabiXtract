import React from 'react';

export default function ProfileDropdown({ darkMode, userName, displayProfileDropdown, setdisplayProfileDropdown, resetUserSession }) {
  const menuBackground = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
  const menuItemStyle = darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50';
  const dividerLineStyle = darkMode ? 'bg-slate-700' : 'bg-slate-100';
  const userNameStyle = darkMode ? 'text-slate-200' : 'text-slate-700';
  const metaInfoStyle = darkMode ? 'text-slate-400' : 'text-slate-400';
  const buttonBackground = darkMode
    ? 'bg-slate-800/80 border-slate-600'
    : 'bg-white/80 border-slate-200';
  const usernameDisplayStyle = darkMode ? 'text-slate-200' : 'text-slate-700';

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setdisplayProfileDropdown(!displayProfileDropdown)}
        className={`flex items-center gap-3 backdrop-blur-md p-2 pr-4 rounded-full shadow-md border
          hover:shadow-lg transition-all ${buttonBackground}`}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className={`font-semibold text-sm ${usernameDisplayStyle}`}>{userName}</span>
      </button>

      {displayProfileDropdown && (
        <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border p-2
          animate-in fade-in slide-in-from-top-2 ${menuBackground}`}>
          <div className={`px-4 py-2 border-b mb-1 ${dividerLineStyle}`}>
            <p className={`text-xs font-medium ${metaInfoStyle}`}>Signed in as</p>
            <p className={`text-sm font-bold truncate ${userNameStyle}`}>{userName}</p>
          </div>
          <button className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${menuItemStyle}`}>
            Settings
          </button>
          <div className={`h-px my-1 ${dividerLineStyle}`} />
          <button
            onClick={() => { setdisplayProfileDropdown(false); resetUserSession(); }}
            className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}