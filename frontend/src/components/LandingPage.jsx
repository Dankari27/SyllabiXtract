import React from 'react';

export default function LandingPage({ darkMode, onGetStarted }) {
  return (

    <div className="relative min-h-screen px-6">


      {/* Display of Main content, centered, max width, animated fade-in on load  */}
      <div className="mx-auto text-center max-w-3xl pt-20 sm:pt-28 animate-in fade-in zoom-in duration-700">

        {/* Styling of font, color, weight for title */}
        <h1 className="text-6xl font-bold text-blue-400 tracking-tighter mb-6">
          SyllabiXtract
        </h1>

        {/* Styling of font, color, weight for subtitle */}
        <p
          className={`text-2xl font-medium mb-10 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
        >
          Stop manually entering deadlines. <br />
          <span className="text-cyan-400 font-bold">AI-powered</span> extraction for students.
        </p>

        {/* Button group, stacks vertically on mobile, horizontal row on larger screens */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

          {/* Primary call to action, get starrted button that triggers a sign up follow on click  */}
          <button
            onClick={onGetStarted}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-transform duration-200 hover:scale-105"
          >
            Get Started Free
          </button>

          {/* Secondary call to action, for tyr demo button
          note: nothing here implemented yet as button does not function or lead to a link */}

          <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold px-6 py-3 rounded-full transition">
            Try Demo Syllabus
          </button>

          {/* Tertiary call to action, for How it works text   
          note: nothing here implemented yet as it is displayed and does not function or lead to a link*/}
          <button className="text-black hover:text-yellow-400 font-semibold px-6 py-3 transition">
            How It Works
          </button>
        </div>
      </div>
    </div>
  );
}