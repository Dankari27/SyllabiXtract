import { useState, useEffect } from 'react';

export default function useTheme() {
  const [darkMode, setIsDark] = useState(() => {
    const saved = localStorage.getItem('sx_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Function call, toggles between light and dark modes
  function toggleTheme() {
    setIsDark(prev => !prev);
  }
  useEffect(() => {
    localStorage.setItem('sx_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);


  return { darkMode, toggleTheme };
}