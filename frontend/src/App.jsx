import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useTheme from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';
import LandingPage from './components/LandingPage';
import ProfileDropdown from './components/ProfileDropdown';
import UploadCard from './components/UploadCard';
import SyllabusCalendar from './components/SyllabusCalendar';

// TODO:
// Make the main page support .doc files along with pdf.
// IDK some other stuff when I think of it


// Main app function for main page
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
    return <div className={`min-h-screen w-full ${darkMode ? 'bg-[#050810]' : 'bg-white'}`}></div>;
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
        WAVY STRAND-LIKE AURORA BACKGROUND (I can't for the life of me get this to work the way I want so this is good enough)
      */}
      <div className={`fixed inset-0 z-0 transition-colors duration-1000 overflow-hidden ${darkMode ? 'bg-[#050810]' : 'bg-slate-50'}`}>
        
        <style>{`
          @keyframes auroraFlow {
            0% { transform: skewX(-15deg) translateX(-10%) translateY(0); opacity: 0.4; }
            50% { transform: skewX(-25deg) translateX(5%) translateY(-2%); opacity: 0.7; }
            100% { transform: skewX(-15deg) translateX(-10%) translateY(0); opacity: 0.4; }
          }
          @keyframes auroraFlowSecondary {
            0% { transform: skewX(20deg) translateX(10%) translateY(0); opacity: 0.3; }
            50% { transform: skewX(10deg) translateX(-5%) translateY(2%); opacity: 0.6; }
            100% { transform: skewX(20deg) translateX(10%) translateY(0); opacity: 0.3; }
          }
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.8; transform: scale(1); filter: brightness(1.5); }
            50% { opacity: 0.1; transform: scale(0.6); filter: brightness(0.5); }
          }
        `}</style>

        {/* Ribbon 1: Deep Cyan Strand */}
        <div 
          className="absolute pointer-events-none w-[120vw] h-[60vh] opacity-40"
          style={{
            top: '-10%',
            left: '-20%',
            background: 'linear-gradient(90deg, transparent 0%, #00FFFF 50%, transparent 100%)',
            filter: 'blur(110px)',
            boxShadow: '0 0 100px 20px #00FFFF',
            animation: 'auroraFlow 22s ease-in-out infinite',
          }}
        />

        {/* Ribbon 2: Wavy Purple Curtain */}
        <div 
          className="absolute pointer-events-none w-[140vw] h-[70vh] opacity-30"
          style={{
            bottom: '10%',
            right: '-30%',
            background: 'linear-gradient(90deg, transparent 0%, #9400D3 50%, transparent 100%)',
            filter: 'blur(130px)',
            boxShadow: '0 0 120px 30px #9400D3',
            animation: 'auroraFlowSecondary 28s ease-in-out infinite',
          }}
        />

        {/* Ribbon 3: Overlapping Teal/Green accents */}
        <div 
          className="absolute pointer-events-none w-[100vw] h-[40vh] opacity-20"
          style={{
            top: '20%',
            left: '10%',
            background: 'linear-gradient(90deg, transparent 0%, #14C8D8 50%, transparent 100%)',
            filter: 'blur(100px)',
            boxShadow: '0 0 80px 20px #14C8D8',
            animation: 'auroraFlow 18s ease-in-out infinite reverse',
          }}
        />

        {/* Starfield with Diamond Stars */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none text-white font-serif">
          <div className="absolute text-xl" style={{ top: '15%', left: '10%', textShadow: '0 0 15px #00FFFF', animation: 'starTwinkle 4s ease-in-out infinite' }}>✦</div>
          <div className="absolute text-2xl" style={{ top: '70%', right: '12%', textShadow: '0 0 20px #00FFFF', animation: 'starTwinkle 5s ease-in-out infinite 1s' }}>✦</div>
          <div className="absolute text-lg" style={{ top: '30%', right: '20%', textShadow: '0 0 15px #9400D3', animation: 'starTwinkle 3.5s ease-in-out infinite 0.5s' }}>✦</div>
          <div className="absolute text-xl" style={{ top: '85%', left: '25%', textShadow: '0 0 20px #9400D3', animation: 'starTwinkle 6s ease-in-out infinite 2s' }}>✦</div>
          <div className="absolute text-sm" style={{ top: '45%', left: '5%', textShadow: '0 0 10px #ffffff', animation: 'starTwinkle 3s ease-in-out infinite 1.5s' }}>✦</div>
        </div>

      </div>

      <div className="relative z-10 w-full flex flex-col items-center py-12 px-4">

        {isAuthenticated && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            
            <ProfileDropdown
              darkMode={darkMode}
              userName={user?.nickname || user?.name || user?.email || "User"}
              displayProfileDropdown={displayProfileDropdown}
              setdisplayProfileDropdown={setdisplayProfileDropdown}
              resetUserSession={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            />

            <header className="text-center w-full max-w-2xl mb-10 mt-12 relative z-10">
              <h1 
                className="text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{ 
                  filter: darkMode 
                    ? 'drop-shadow(0px 0px 15px rgba(34, 211, 238, 0.6)) drop-shadow(0px 0px 30px rgba(168, 85, 247, 0.4))' 
                    : 'none' 
                }}
              >
                SyllabiXtract
              </h1>
              <p className={`text-xl font-bold max-w-lg text-center leading-relaxed mx-auto drop-shadow-md
                ${darkMode ? 'text-white/90' : 'text-slate-800'}`}>
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

        {!isAuthenticated && (
           <div className="mt-20">
              <LandingPage
                darkMode={darkMode}
                onGetStarted={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
              />
           </div>
        )}
      </div>

      <ThemeToggle darkMode={darkMode} switchTheme={toggleTheme} />
    </div>
  );
}

export default App;