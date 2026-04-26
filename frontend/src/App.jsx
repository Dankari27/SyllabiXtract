import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useTheme from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './components/LandingPage';
import ProfileDropdown from './components/ProfileDropdown';
import UploadCard from './components/UploadCard';
import SyllabusCalendar from './components/SyllabusCalendar';

function App() {
  const { 
    loginWithRedirect, 
    logout, 
    user, 
    isAuthenticated, 
    isLoading, 
    getAccessTokenSilently,
    error 
  } = useAuth0();

  const { darkMode, toggleTheme } = useTheme();
  
  const [displayProfileDropdown, setdisplayProfileDropdown] = useState(false); 
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Select a syllabus first!");
      return;
    }

    setUploadStatus(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch('https://syllabixtract-api.onrender.com/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Backend upload failed');

      const data = await response.json();
      
      if (data && data.events) {
        setExtractedData(data.events); 
      } else {
        throw new Error("AI returned an empty or invalid schedule.");
      }

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to process syllabus. Error: " + error.message);
    } finally {
      setUploadStatus(false);
    }
  };

  function removeSelectedFile() {
    setFile(null);
    const input = document.getElementById('file-input');
    if (input) input.value = '';
  }

  if (isLoading) {
    return <div className={`min-h-screen w-full ${darkMode ? 'bg-[#0a0f1c]' : 'bg-slate-50'}`}></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center relative z-10">
        <h1 className="text-4xl font-black text-red-500 mb-4">Authentication Error</h1>
        <p className="text-xl font-mono bg-red-100 text-red-800 p-4 rounded-xl border border-red-300">
          {error.message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 bg-slate-800 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Retry Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center font-sans overflow-x-hidden">
      
      {/* ========================================================
        ATMOSPHERIC AURORA BACKGROUND (Cyan & Purple)
        ========================================================
      */}
      <div className={`fixed inset-0 z-0 transition-colors duration-700 ${darkMode ? 'bg-[#0a0f1c]' : 'bg-slate-50'}`}>
        {/* Top Left Cyan Glow */}
        <div className={`absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[100px] pointer-events-none transition-colors duration-700
          ${darkMode ? 'bg-cyan-900/30' : 'bg-cyan-300/40'}`} 
        />
        {/* Top Right Purple Glow */}
        <div className={`absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-700
          ${darkMode ? 'bg-purple-900/30' : 'bg-purple-300/40'}`} 
        />
        {/* Bottom Blue Glow */}
        <div className={`absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-700
          ${darkMode ? 'bg-blue-900/20' : 'bg-blue-300/30'}`} 
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center py-12 px-4">

        {!isAuthenticated && (
          <>
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => loginWithRedirect()}
                className={`font-semibold px-6 py-2 rounded-full border transition-all shadow-sm hover:shadow-md
                  ${darkMode
                    ? 'border-slate-600 text-slate-200 bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-md'
                    : 'border-slate-300 text-slate-700 bg-white/50 hover:bg-white/80 backdrop-blur-md'
                  }`}
              >
                Log In
              </button>
            </div>

            <LandingPage
              darkMode={darkMode}
              onGetStarted={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
            />
          </>
        )}

        {isAuthenticated && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">

            <ProfileDropdown
              darkMode={darkMode}
              userName={user?.nickname || user?.name || user?.email || "User"}
              displayProfileDropdown={displayProfileDropdown}
              setdisplayProfileDropdown={setdisplayProfileDropdown}
              resetUserSession={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            />

            <header className="text-center w-full max-w-2xl mb-10 mt-4">
              <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                SyllabiXtract
              </h1>
              <p className={`text-lg font-medium max-w-md text-center leading-relaxed mx-auto
                ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Convert your messy syllabus into an organized calendar in seconds.
              </p>
            </header>

            <UploadCard
              darkMode={darkMode}
              file={file}
              uploadStatus={uploadStatus}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              onremoveSelectedFile={removeSelectedFile}
            />

            {extractedData && (
              <SyllabusCalendar 
                data={extractedData} 
                darkMode={darkMode} 
              />
            )}

          </div>
        )}

      </div>

      <ThemeToggle darkMode={darkMode} switchTheme={toggleTheme} />
    </div>
  );
}

export default App;