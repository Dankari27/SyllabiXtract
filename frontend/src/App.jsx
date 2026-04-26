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
    return <div className={`min-h-screen w-full ${darkMode ? 'bg-[#101524]' : 'bg-slate-50'}`}></div>;
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
      
      {/*
        WAVY AURORA BACKGROUND
        Uses stretched ellipses to create ribbons of light.
      */}
      <div className={`fixed inset-0 z-0 transition-colors duration-1000 overflow-hidden ${darkMode ? 'bg-[#0b101e]' : 'bg-slate-100'}`}>
        
        <style>{`
          @keyframes waveLeft {
            0%, 100% { transform: rotate(-15deg) translateY(0) scaleY(1); }
            50% { transform: rotate(-10deg) translateY(-5vh) scaleY(1.2); }
          }
          @keyframes waveRight {
            0%, 100% { transform: rotate(15deg) translateY(0) scaleY(1); }
            50% { transform: rotate(20deg) translateY(5vh) scaleY(1.1); }
          }
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.9; transform: scale(1); filter: brightness(1.2); }
            50% { opacity: 0.2; transform: scale(0.7); filter: brightness(0.5); }
          }
        `}</style>

        {/* Base dark/light gradient */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: darkMode 
              ? 'radial-gradient(ellipse at top, rgba(11, 16, 30, 0) 0%, rgba(8, 12, 24, 1) 100%)'
              : 'radial-gradient(ellipse at top, rgba(241, 245, 249, 0) 0%, rgba(226, 232, 240, 1) 100%)',
          }}
        />

        {/* Ribbon 1: Cyan Wave (Left) */}
        <div 
          className="absolute pointer-events-none rounded-[100%]"
          style={{
            top: '20%',
            left: '-30%',
            width: '150vw',
            height: '40vh',
            background: darkMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0, 200, 255, 0.2)',
            filter: 'blur(90px)',
            boxShadow: darkMode ? '0 0 100px 50px rgba(0, 255, 255, 0.1)' : 'none',
            animation: 'waveLeft 18s ease-in-out infinite',
          }}
        />

        {/* Ribbon 2: Purple Wave (Right/Center) */}
        <div 
          className="absolute pointer-events-none rounded-[100%]"
          style={{
            top: '35%',
            right: '-20%',
            width: '140vw',
            height: '45vh',
            background: darkMode ? 'rgba(168, 85, 247, 0.18)' : 'rgba(168, 85, 247, 0.2)',
            filter: 'blur(100px)',
            boxShadow: darkMode ? '0 0 120px 60px rgba(168, 85, 247, 0.1)' : 'none',
            animation: 'waveRight 22s ease-in-out infinite',
          }}
        />

        {/* Layer 3: Distant Diamond Stars */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none text-white font-serif">
          {/* Cyan Stars */}
          <div className="absolute text-xl" style={{ top: '12%', left: '15%', textShadow: '0 0 10px #00FFFF', animation: 'starTwinkle 4s ease-in-out infinite' }}>✦</div>
          <div className="absolute text-2xl" style={{ top: '65%', right: '15%', textShadow: '0 0 12px #00FFFF', animation: 'starTwinkle 6s ease-in-out infinite 1s' }}>✦</div>
          
          {/* Purple Stars */}
          <div className="absolute text-lg" style={{ top: '25%', right: '25%', textShadow: '0 0 10px #a855f7', animation: 'starTwinkle 5s ease-in-out infinite 0.5s' }}>✦</div>
          <div className="absolute text-xl" style={{ top: '80%', left: '20%', textShadow: '0 0 12px #a855f7', animation: 'starTwinkle 4.5s ease-in-out infinite 2s' }}>✦</div>
          
          {/* Small Background Stars */}
          <div className="absolute text-sm" style={{ top: '40%', left: '10%', textShadow: '0 0 8px #ffffff', animation: 'starTwinkle 3s ease-in-out infinite 1.5s' }}>✦</div>
          <div className="absolute text-sm" style={{ top: '15%', right: '40%', textShadow: '0 0 8px #ffffff', animation: 'starTwinkle 5.5s ease-in-out infinite 0.8s' }}>✦</div>
        </div>

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

            <header className="text-center w-full max-w-2xl mb-10 mt-4 relative z-10">
              <h1 
                className="text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-sm"
                style={{ filter: darkMode ? 'drop-shadow(0px 0px 20px rgba(168, 85, 247, 0.4))' : 'none' }}
              >
                SyllabiXtract
              </h1>
              <p className={`text-lg font-medium max-w-md text-center leading-relaxed mx-auto drop-shadow-sm
                ${darkMode ? 'text-slate-100' : 'text-slate-700'}`}>
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