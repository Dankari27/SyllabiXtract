import React from 'react';

export default function changeTheme({ darkMode, switchTheme }) {
  return (
    <button
      onClick={switchTheme}
      aria-label="Toggle light/dark mode"
      className={`fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center
        shadow-lg border transition-all duration-300 hover:scale-110 active:scale-95
        ${darkMode
          ? 'bg-slate-800 border-slate-600 text-yellow-400 hover:bg-slate-700'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
    >
      {darkMode ? (
        /* Sun */
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm7-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM3 11a1 1 0 110 2H2a1 1 0 110-2h1zm15.657-6.657a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.464 17.536a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM21 17.536l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM5.05 5.05a1 1 0 011.414 0l.707.707A1 1 0 115.757 7.17l-.707-.707A1 1 0 015.05 5.05zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
        </svg>
      ) : (
        /* Moon */
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      )}
    </button>
  );
}