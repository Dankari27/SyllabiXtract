import React, { useState } from 'react';

export default function AuthCard({ darkMode, initialMode, handleLogin, returnToLanding }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  function clearFields() {
    setUserName(""); setEmail(""); setPassword("");
    setConfirmPassword(""); setAuthError("");
  }

  function switchMode() {
    setIsLogin(!isLogin);
    clearFields();
  }

  // Function for handling authentication
  function handleSubmit() {
    setAuthError("");
    if (!email.trim()) { setAuthError("Email is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setAuthError("Please enter a valid email address."); return; }
    if (!password.trim()) { setAuthError("Password is required."); return; }
    if (!isLogin) {
      if (!userName.trim()) { setAuthError("Please enter a username."); return; }
      if (password.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
      if (password !== confirmPassword) { setAuthError("Passwords do not match."); return; }
    }
    const displayName = userName.trim() || email.split('@')[0];
    handleLogin(displayName);
    clearFields();
  }

  // Password validation mechanisms and styling for light and dark mode
  const passwordMismatch = !isLogin && confirmPassword.length > 0 && password !== confirmPassword;
  const passwordMatch = !isLogin && confirmPassword.length > 0 && password === confirmPassword;

  const panelStyle = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'; // background and boarder color themes for light/dark modes
  const authHeading = darkMode ? 'text-white' : 'text-slate-800'; // Heading color themes for light/dark modes
  const authsubheading = darkMode ? 'text-slate-400' : 'text-slate-400'; // subtitle color themes for light/dark modes
  const label = darkMode ? 'text-slate-400' : 'text-slate-500';// lable color themes for light/dark modes
  const inputStyle = 'w-full p-4 border rounded-xl outline-none focus:ring-2 transition-all'; // Base styling applied to all input fields (email, password, username)
  const inputValid = darkMode // background and boarder color themes for light/dark modes for when input is valid
    ? `${inputStyle} bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500`
    : `${inputStyle} bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500`;
  const inputInvalid = darkMode
    ? `${inputStyle} bg-red-900/30 border-red-500 text-white placeholder-slate-400 focus:ring-red-500`
    : `${inputStyle} bg-red-50 border-red-400 text-slate-800 focus:ring-red-400`;
  const errorAlert = darkMode
    ? 'bg-red-900/30 border-red-700 text-red-400'
    : 'bg-red-50 border-red-200 text-red-600';

  return (
    <div className={`w-full max-w-md p-10 rounded-3xl shadow-2xl border animate-in slide-in-from-bottom-8 transition-colors duration-300 ${panelStyle}`}>
      <h2 className={`text-3xl font-black mb-1 ${authHeading}`}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>
      <p className={`text-sm mb-6 ${authsubheading}`}>
        {isLogin ? "Sign in to access your dashboard." : "Create a free acount today!"}
      </p>

      <div className="space-y-4">

        {!isLogin && (
          <div>
            <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${label}`}>Username</label>
            <input
              type="text" placeholder="Username" value={userName}
              onChange={(e) => { setUserName(e.target.value); setAuthError(""); }}
              className={inputValid}
            />
          </div>
        )}

        <div>
          <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${label}`}>Email</label>
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => { setEmail(e.target.value); setAuthError(""); }}
            className={inputValid}
          />
        </div>

        <div>
          <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${label}`}>Password</label>
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
            className={inputValid}
          />
        </div>

        {!isLogin && (
          <div>
            <label className={`block text-xs font-semibold mb-1 uppercase tracking-wide ${label}`}>Confirm Password</label>
            <input
              type="password" placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setAuthError(""); }}
              className={passwordMismatch ? inputInvalid : inputValid}
            />
            {passwordMismatch && (
              <p className="text-red-400 text-xs font-medium mt-1 animate-in fade-in duration-200">✕ Passwords do not match</p>
            )}
            {passwordMatch && (
              <p className="text-green-500 text-xs font-medium mt-1 animate-in fade-in duration-200">✓ Passwords match</p>
            )}
          </div>
        )}

        {authError && (
          <div className={`text-sm font-medium px-4 py-3 rounded-xl border animate-in fade-in duration-200 ${errorAlert}`}>
            ⚠ {authError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLogin ? "Sign In →" : "Create Account →"}
        </button>

        <button onClick={switchMode} className="w-full text-blue-500 font-bold text-sm hover:underline pt-1">
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log in"}
        </button>

        <button
          onClick={() => { returnToLanding(); clearFields(); }}
          className={`w-full font-medium text-sm transition-colors
            ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}