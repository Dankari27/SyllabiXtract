import React from 'react';

export default function ResultsPanel({ darkMode, data }) {
  if (!data) return null;

  const containerStyle = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const headingStyle = darkMode ? 'text-slate-100 border-slate-700' : 'text-slate-800 border-slate-200';

  return (
    <section className={`w-full max-w-2xl mt-8 p-6 rounded-2xl shadow-xl border transition-colors duration-300 ${containerStyle}`}>
      <h3 className={`text-xl font-bold mb-4 border-b pb-2 ${headingStyle}`}>
        Extracted Schedule Data
      </h3>
      <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto">
        <pre className="text-sm text-green-400 font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </section>
  );
}