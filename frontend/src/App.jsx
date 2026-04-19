import React, { useState, useEffect } from 'react';
import useTheme from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './components/LandingPage';
import AuthCard from './components/AuthCard';
import ProfileDropdown from './components/ProfileDropdown';
import UploadCard from './components/UploadCard';
import ResultsPanel from './components/ResultsPanel';
/**
 * SyllabiXtract Starter Template
 * This component handles:
 * 1. File selection (PDF only)
 * 2. Uploading to the backend on Render for testing
 * 3. Displaying the raw JSON response from Vercel
 */
function App() {
  const [authMode, setAuthMode] = useState('login');
  const { darkMode, toggleTheme } = useTheme();
  const [userName, setUserName] = useState(""); 
  const [displayProfileDropdown, setdisplayProfileDropdown] = useState(false); 
  const [activePage, setactivePage] = useState('landing');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem('sx_userName');
    if (savedName) {
      setUserName(savedName);
      setExtractedData(null);
      setFile(null);
      setactivePage('app');
    }
  }, []);
  // 1. Capture the file from the input
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  // Ship the file to the backend
  const handleUpload = async () => {
    if (!file) {
      alert("Select a syllabus first!");
      return;
    }

    setUploadStatus(true);

    const formData = new FormData();
    formData.append('file', file);

    try {

      // This url allows render to deploy the backend.
      const response = await fetch('https://syllabixtract-api.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend upload failed');

      const data = await response.json();
      setExtractedData(data); // This is where Gemini's JSON will live
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to reach the backend. Is your Render server awake?");
    } finally {
      setUploadStatus(false);
    }
  };

  // Function call for successful login, sets uer info and navigation
  function processLogin(name) {
    localStorage.setItem('sx_userName', name);
    localStorage.setItem('sx_displayName', name);
    setExtractedData(null);
    setFile(null);
    setUserName(name);
    setactivePage('app');
  }

  // Function call for clearing user data and reseting activePage or state
  function resetUserSession() {
    localStorage.removeItem('sx_userName');
    setUserName("");
    setactivePage('landing');
    setdisplayProfileDropdown(false);
    setExtractedData(null);
    setFile(null);
  }
  // Function call for reseting file input and clearing file state
  function removeSelectedFile() {
    setFile(null);
    // This resets the actual file input so the same file can be re-selected
    const input = document.getElementById('file-input');
    if (input) input.value = '';
  }
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center font-sans overflow-x-hidden">


      {/* Layer for contnet */}
      <div className="relative z-10 w-full flex flex-col items-center py-12 px-4">

        {/* Controls current view of the app landing page*/}
        {activePage === 'landing' && (
          <>
            {/* Top-right Log In button */}
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setactivePage('auth');
                }}
                className={`font-semibold px-6 py-2 rounded-full border transition
          ${darkMode
                    ? 'border-white text-white hover:bg-white/10'
                    : 'border-slate-800 text-slate-800 hover:bg-slate-100'
                  }`}
              >
                Log In
              </button>
            </div>

            <LandingPage
              darkMode={darkMode}
              onGetStarted={() => {
                setAuthMode('signup');
                setactivePage('auth');
              }}
            />
          </>
        )}

        {/* Controls current view of the app authentication page*/}
        {activePage === 'auth' && (
          <AuthCard
            darkMode={darkMode}
            initialMode={authMode}
            handleLogin={processLogin}
            returnToLanding={() => setactivePage('landing')}
          />
        )}

        {/* Controls current view of the main upload dashboard*/}
        {activePage === 'app' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">

            <ProfileDropdown
              darkMode={darkMode}
              userName={userName}
              displayProfileDropdown={displayProfileDropdown}
              setdisplayProfileDropdown={setdisplayProfileDropdown}
              resetUserSession={resetUserSession}
            />

            <header className="text-center w-full max-w-2xl mb-10">
              <h1 className="text-5xl font-black text-blue-500 tracking-tighter mb-3">
                SyllabiXtract
              </h1>
              <p className={`text-lg font-medium max-w-md text-center leading-relaxed mx-auto
                ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Convert your messy syllabus into an organized calendar in seconds.
              </p>
            </header>

            <UploadCard
              darkMode={darkMode}
              file={file}
              uploadStatus={uploadStatus}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              onremoveSelectedFile={removeSelectedFile}  // ← add this
            />

            <ResultsPanel darkMode={darkMode} data={extractedData} />

            <button
              onClick={() => setactivePage('landing')}
              className={`mt-8 font-bold transition-colors
                ${darkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-500'}`}
            >
              ← Back to Landing Page
            </button>
          </div>
        )}

      </div>

      {/* Page background adapts to theme:
      - Light mode has radial gradient
      - Dark mode has solid slate */}
      <div
        className="absolute inset-0 z-0 transition-colors duration-500"
        style={{
          backgroundImage: darkMode
            ? 'none'
            : `radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 100%)`,
          backgroundColor: darkMode ? '#0f172a' : 'transparent',
          backgroundSize: '100% 100%',
        }}
      />

      {/* A Floating theme toggle that will always be visible in each page */}
      <ThemeToggle darkMode={darkMode} switchTheme={toggleTheme} />

    </div>
  );
}

export default App;