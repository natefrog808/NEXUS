// src/main.jsx
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global Theme Context for dynamic theming
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    mode: 'dark', // Default to dark for cyberpunk aesthetic
    primary: '#8A2BE2', // Matches index.css
    secondary: '#FF4500',
    tertiary: '#00CED1',
  });

  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme) => setTheme((prev) => ({ ...prev, ...newTheme })),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Error Boundary to catch and display glitches gracefully
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NEXUS89 Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 font-['Roboto_Mono']">
          <h1 className="text-5xl font-bold text-purple-400 mb-6 animate-[flicker_2s_infinite]">
            NEXUS89 Critical Glitch
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            A reality distortion has destabilized the system.
          </p>
          <pre className="text-sm text-red-400 bg-gray-900/80 p-4 rounded-lg max-w-lg overflow-auto mb-6">
            {this.state.error?.message || 'Unknown anomaly detected'}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="py-3 px-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-lg font-bold shadow-[0_0_15px_rgba(138,43,226,0.7)] hover:shadow-[0_0_25px_rgba(255,69,0,0.7)] transition-all duration-300"
          >
            Reboot Nexus
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Performance optimization with Suspense
function Main() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <ThemeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </React.Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-2xl text-cyan-400 animate-pulse">
        Initializing NEXUS89...
      </div>
    </div>
  );
}

// Bootstrap the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('NEXUS89 Initialization Failed: Root element not found');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );

  // Log boot sequence
  console.log('%cNEXUS89 Boot Sequence Initiated', 'color: #8A2BE2; font-size: 16px; font-family: "Roboto Mono", monospace;');
  console.log('%cPROJECT89 Perception-Hacking Suite Online', 'color: #00CED1; font-size: 12px;');
  console.log('%cArgOS HESMS Cognitive Core Active', 'color: #FF4500; font-size: 12px;');
}
