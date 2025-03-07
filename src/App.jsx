// src/App.jsx
import React, { useState, useEffect } from 'react';
import Nexus89 from './pages/Nexus89'; // Renamed from RealitySandbox
import { Sparkles, Github, Brain, Zap, CloudLightning } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Simulate NEXUS89 system boot-up
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Extended for dramatic effect

    return () => clearTimeout(timer);
  }, []);

  const handleEnterNexus = () => {
    setShowIntro(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showIntro) {
    return <IntroScreen onEnter={handleEnterNexus} />;
  }

  return <Nexus89 />;
}

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Booting NEXUS89 Core...');
  const [glitchEffect, setGlitchEffect] = useState(0);

  useEffect(() => {
    const statusMessages = [
      'Booting NEXUS89 Core...',
      'Initializing ArgOS HESMS Neural Matrix...',
      'Loading PROJECT89 Perception-Hacking Suite...',
      'Calibrating Quantum Glitch Detectors...',
      'Syncing Agent Consciousness Threads...',
      'Generating Dreamscape Protocols...',
      'Stabilizing Reality Layers...',
      'Priming Chaos Pulse Generators...',
    ];

    let currentStatus = 0;
    const statusInterval = setInterval(() => {
      currentStatus = (currentStatus + 1) % statusMessages.length;
      setStatusText(statusMessages[currentStatus]);
      setGlitchEffect(Math.random() * 2); // Subtle glitch flicker
    }, 350);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6 font-['Roboto_Mono']">
      <div className="w-full max-w-lg relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 blur-2xl animate-pulse" />
        <h1 className="text-5xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-cyan-400 to-orange-500 animate-[flicker_2s_infinite]">
          NEXUS89
          <span className="block text-lg mt-2 text-gray-400">Cognitive Reality Nexus</span>
        </h1>

        <div className="mb-6 relative">
          <div className="flex justify-between mb-2 text-gray-400 text-sm">
            <span>System Boot Sequence</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-600 via-cyan-500 to-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, filter: `blur(${glitchEffect}px)` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-300 flex items-center justify-center">
          <Zap size={16} className="text-orange-500 mr-2 animate-[pulse_1s_infinite]" />
          <span className="relative">
            {statusText}
            <span className="absolute inset-0 text-orange-400 opacity-20 animate-[glitch_0.5s_infinite]" style={{ transform: `translate(${glitchEffect}px, ${glitchEffect}px)` }}>
              {statusText}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function IntroScreen({ onEnter }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-['Roboto_Mono'] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.1)_0%,transparent_70%)] animate-[pulse_10s_infinite]" />
      <div className="max-w-5xl mx-auto py-16 relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-cyan-400 to-orange-500 animate-[flicker_3s_infinite]">
            NEXUS89
          </h1>
          <p className="text-2xl mt-3 text-gray-300 tracking-wide">Cognitive Reality Nexus</p>
          <div className="mt-6 inline-flex items-center rounded-full bg-gray-900/80 px-4 py-2 text-sm border border-gray-700/50 shadow-md">
            <span className="mr-2 font-medium text-purple-400">v2.0.0</span>
            <span className="text-gray-500">Experimental Build</span>
          </div>
        </header>

        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-8 mb-10 shadow-[0_0_20px_rgba(138,43,226,0.2)] backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400 tracking-wide">Welcome to the Neon Abyss</h2>
          <p className="mb-6 text-gray-200 text-lg">
            <span className="text-purple-400">NEXUS89</span> fuses <span className="text-cyan-400">PROJECT89's Perception-Hacking Suite</span> 
            with the <span className="text-orange-400">ArgOS HESMS</span>—a cyberpunk crucible where AI agents weave consciousness into 
            glitch-soaked realities. Built with React, Tailwind CSS, and Lucide icons, this is where perception bends and chaos reigns.
          </p>
          <p className="mb-6 text-gray-200 text-lg">
            Prepare to witness:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-300">
            <li className="flex items-start">
              <Brain size={18} className="text-purple-500 mr-2 mt-1" />
              Memories bleeding into spacetime rifts
            </li>
            <li className="flex items-start">
              <Sparkles size={18} className="text-cyan-500 mr-2 mt-1" />
              Dreams erupting as chaos pulses
            </li>
            <li className="flex items-start">
              <Zap size={18} className="text-orange-500 mr-2 mt-1" />
              Collective sync spawning emergent nexuses
            </li>
            <li className="flex items-start">
              <CloudLightning size={18} className="text-purple-500 mr-2 mt-1" />
              Reality warped by your command
            </li>
          </ul>
          <p className="text-amber-400 italic text-center text-lg">
            "In the nexus, we don’t simulate reality—we rewrite it."
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-8 mb-10 shadow-[0_0_20px_rgba(138,43,226,0.2)] backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400 tracking-wide">Perception Arsenal</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Reality Glitcher", desc: "Manipulate glitches—amplify, stabilize, harvest—in a neon-lit chaos field.", icon: <Zap size={20} /> },
              { title: "Dream Weaver", desc: "Plant dream seeds and harvest artifacts as reality bends to subconscious will.", icon: <Sparkles size={20} /> },
              { title: "Synchronicity Detector", desc: "Map cyan-threaded pulses of collective consciousness sync.", icon: <CloudLightning size={20} /> },
              { title: "Mind Mirror", desc: "Reflect agent psyches in radial webs of fractured traits.", icon: <Brain size={20} /> },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300">
                <h3 className="font-bold mb-2 text-purple-400 flex items-center">
                  {icon}
                  <span className="ml-2">{title}</span>
                </h3>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onEnter}
            className="py-4 px-10 bg-gradient-to-r from-purple-600 via-cyan-500 to-orange-500 rounded-lg text-lg font-bold shadow-[0_0_15px_rgba(138,43,226,0.7)] hover:shadow-[0_0_25px_rgba(255,69,0,0.7)] transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          >
            Enter NEXUS89
          </button>
        </div>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <div className="flex justify-center items-center gap-6 mb-3">
            <a href="https://github.com/yourusername/nexus89" className="flex items-center hover:text-purple-400 transition-colors duration-200">
              <Github size={18} className="mr-2" />
              <span>GitHub</span>
            </a>
          </div>
          <p>PROJECT89 × ArgOS Collaboration © 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
