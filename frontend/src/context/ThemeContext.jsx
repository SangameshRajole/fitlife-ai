// =============================================
// context/ThemeContext.jsx
// Manages Dark / Light mode globally
// =============================================

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has a saved preference, else use system preference
  const getInitialTheme = () => {
    const saved = localStorage.getItem('fitlife-theme');
    if (saved) return saved;

    // Check system dark mode preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to <html> element whenever it changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('fitlife-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => useContext(ThemeContext);