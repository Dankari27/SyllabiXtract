import React from 'react';

export default function UploadCard({ darkMode, file, uploadStatus, onFileChange, onUpload, onremoveSelectedFile }) {
  const containerStyle = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'; // // Card background & border, dark slate in dark mode, white in light mode
  const uploadAreaClass = darkMode // file upload area border & background changes based on dark/light mode
    ? 'border-blue-700 bg-blue-900/20 hover:bg-blue-900/30'
    : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50';
  const fileInputStyle = darkMode // Style for file input, light for light mode, dark for dark mode
    ? 'text-slate-400 file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-900'
    : 'text-slate-500 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200';
  const hintTextClass = darkMode ? 'text-slate-400' : 'text-slate-600'; // Style for hint text, light for light mode, dark for dark mode

  return (
    <main className={`w-full max-w-2xl p-8 rounded-2xl shadow-xl border transition-colors duration-300 ${containerStyle}`}>

      <div className={`border-2 border-dashed transition-colors duration-200 rounded-xl p-10
        flex flex-col items-center justify-center text-center cursor-pointer mb-6 ${uploadAreaClass}`}>
        <input
          id="file-input"
          type="file"
          // might need to add .docx and more
          accept=".pdf"
          onChange={onFileChange}
          className={`block w-full text-sm mb-3
    file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0
    file:text-sm file:font-semibold cursor-pointer ${fileInputStyle}`}
        />

        {/* File selected state */}
        {file ? (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-green-500 font-semibold text-sm">✓ {file.name}</span>
            <button
              onClick={onremoveSelectedFile}
              className="text-red-400 hover:text-red-600 text-xs font-bold border border-red-300 hover:border-red-500 px-2 py-1 rounded-lg transition"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <p className={`text-sm font-medium mt-2 ${hintTextClass}`}>
            Or drag and drop your syllabus PDF here
          </p>
        )}
      </div>

      {/* Upload button — disabled if no file */}
      <button
        onClick={onUpload}
        disabled={uploadStatus || !file}
        className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold text-lg transition-all shadow-md
          ${uploadStatus || !file
            ? 'bg-slate-500 cursor-not-allowed opacity-60'
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
          }`}
      >
        {uploadStatus ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing...
          </span>
        ) : 'Extract Schedule →'}
      </button>
    </main>
  );
}