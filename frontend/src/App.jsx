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
    return <div className={`min-h-screen w-full ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}></div>;
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
        GLOWING & ANIMATED AURORA BACKGROUND
        Layers complex animated CSS gradients with proper blooming and a twinkling starfield.
      */}
      <div className={`fixed inset-0 z-0 transition-colors duration-1000 ${darkMode ? 'bg-[#080c18]' : 'bg-slate-100'}`}>
        
        {/* Defining all custom animations natively in the component for easy use */}
        <style>{`
          @keyframes auroraFlowCentral {
            0% { background-position: 50% 50%, 0% 0%; }
            100% { background-position: 50% 50%, 100% 100%; }
          }
          @keyframes auroraFlowLeft {
            0%, 100% { transform: scale(1) translate(0, 0); }
            50% { transform: scale(1.05) translate(-1vw, -2vw); }
          }
          @keyframes auroraFlowRight {
            0%, 100% { transform: scale(1) translate(0, 0); }
            50% { transform: scale(1.05) translate(1vw, 2vw); }
          }
          @keyframes bloomIn {
            0% { opacity: 0; filter: blur(5px); }
            100% { opacity: 1; filter: blur(0px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          @keyframes coloredHalo {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.5); opacity: 0.3; }
          }
        `}</style>
        
        {/* Main, layered central aurora. Layers are complex for performance-agnostic bloom. */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: darkMode 
              ? 'radial-gradient(125% 125% at 50% 10%, rgba(20, 200, 216, 0.4) 0%, rgba(148, 0, 211, 0.3) 40%, rgba(8, 12, 24, 0.9) 100%)'
              : 'radial-gradient(125% 125% at 50% 10%, rgba(100, 240, 245, 0.3) 0%, rgba(200, 150, 255, 0.2) 40%, #f1f5f9 100%)',
            backgroundSize: '100% 100%',
            animation: 'bloomIn 1.5s ease-out',
          }}
        />

        {/* Layer 2: Left Sweeping Cyan Curtain with Bloom */}
        <div 
          className={`absolute rounded-full pointer-events-none transition-all duration-1000
            ${darkMode ? 'bg-[#00FFFF]' : 'bg-[#a0f0f5]'}`} 
          style={{
            top: '-15%',
            left: '-20%',
            width: '60vw',
            height: '60vw',
            filter: darkMode ? 'blur(30px) brightness(0.6)' : 'blur(30px) brightness(1)',
            opacity: darkMode ? 0.3 : 0.2,
            boxShadow: darkMode 
              ? '0 0 50px 10px #00FFFF, 0 0 100px 30px #14C8D8, 0 0 200px 80px rgba(20, 200, 216, 0.4)'
              : '0 0 30px 10px #14C8D8, 0 0 60px 30px rgba(100, 240, 245, 0.3)',
            animation: 'auroraFlowLeft 12s ease-in-out infinite, bloomIn 2s ease-out 0.5s',
          }}
        />

        {/* Layer 3: Right Swirling Purple Curtain with Bloom */}
        <div 
          className={`absolute rounded-full pointer-events-none transition-all duration-1000
            ${darkMode ? 'bg-[#9400D3]' : 'bg-[#d8a0ff]'}`} 
          style={{
            top: '10%',
            right: '-15%',
            width: '65vw',
            height: '65vw',
            filter: darkMode ? 'blur(40px) brightness(0.7)' : 'blur(40px) brightness(1.2)',
            opacity: darkMode ? 0.2 : 0.15,
            boxShadow: darkMode 
              ? '0 0 60px 15px #9400D3, 0 0 120px 40px #8A2BE2, 0 0 240px 90px rgba(148, 0, 211, 0.3)'
              : '0 0 40px 15px #8A2BE2, 0 0 80px 40px rgba(200, 150, 255, 0.2)',
            animation: 'auroraFlowRight 15s ease-in-out infinite, bloomIn 2s ease-out 1s',
          }}
        />

        {/* Layer 4: Distant Twinkling Starfield with Colored Halos */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Small dots are core, larger translucent dots are colored halo */}
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: '15%', left: '20%', animation: 'twinkle 4s ease-in-out infinite' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{ top: '15%', left: '20%', transform: 'translate(-1px, -1px)', background: 'radial-gradient(#00FFFF, transparent 70%)', opacity: 0.7, animation: 'coloredHalo 4s ease-in-out infinite' }} />
          
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: '25%', right: '30%', animation: 'twinkle 3s ease-in-out infinite 0.5s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{ top: '25%', right: '30%', transform: 'translate(-1px, -1px)', background: 'radial-gradient(#9400D3, transparent 70%)', opacity: 0.7, animation: 'coloredHalo 3s ease-in-out infinite 0.5s' }} />

          <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: '70%', left: '80%', animation: 'twinkle 5s ease-in-out infinite 1s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{ top: '70%', left: '80%', transform: 'translate(-1px, -1px)', background: 'radial-gradient(#14C8D8, transparent 70%)', opacity: 0.7, animation: 'coloredHalo 5s ease-in-out infinite 1s' }} />
        
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ top: '10%', right: '10%', animation: 'twinkle 2s ease-in-out infinite 1.5s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{ top: '10%', right: '10%', transform: 'translate(-1px, -1px)', background: 'radial-gradient(#8A2BE2, transparent 70%)', opacity: 0.7, animation: 'coloredHalo 2s ease-in-out infinite 1.5s' }} />
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