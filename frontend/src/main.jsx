// =============================================
// main.jsx — App Entry Point
// =============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ThemeProvider wraps everything so dark mode works everywhere */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);