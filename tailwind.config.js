/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths for purging unused styles
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],

  // Dark mode enabled by default (class strategy for future toggling)
  darkMode: 'class',

  // Custom theme extensions
  theme: {
    extend: {
      // Colors matching NEXUS89's cyberpunk palette
      colors: {
        nexus: {
          primary: '#8A2BE2',    // Dreamy purple
          secondary: '#FF4500',  // Glitch orange
          tertiary: '#00CED1',   // Sync cyan
          background: '#0A0A1A', // Deep void
          text: '#E6E6FA',       // Lavender text
          panel: '#16162A',      // Darker panels
          border: '#2A2A5A',     // Neon edge
          highlight: '#FFD700',  // Gold accent
          shadow: 'rgba(0, 0, 0, 0.5)',
        },
      },

      // Font families for cyberpunk typography
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },

      // Custom spacing and sizing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // Border radius for sleek components
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },

      // Box shadow enhancements for neon glows
      boxShadow: {
        'neon': '0 0 5px rgba(138, 43, 226, 0.5), 0 0 10px rgba(0, 206, 209, 0.5)',
        'cyber': '0 0 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(138, 43, 226, 0.2)',
        'dream': '0 0 20px rgba(138, 43, 226, 0.4)',
      },

      // Custom animations for glitch and cyberpunk effects
      animation: {
        'flicker': 'flicker 0.1s infinite',
        'glitch': 'glitch 0.5s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 8s ease-in-out infinite',
        'line-glitch': 'lineGlitch 5s linear infinite alternate',
      },

      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(2px, -2px)' },
          '40%': { transform: 'translate(-2px, 2px)' },
          '60%': { transform: 'translate(1px, 1px)' },
          '80%': { transform: 'translate(-1px, -1px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.05)' },
        },
        lineGlitch: {
          '0%': { left: '15%', width: '25%' },
          '20%': { left: '35%', width: '15%' },
          '40%': { left: '50%', width: '30%' },
          '60%': { left: '65%', width: '20%' },
          '80%': { left: '25%', width: '10%' },
          '100%': { left: '15%', width: '25%' },
        },
      },

      // Custom opacity for subtle effects
      opacity: {
        '15': '0.15',
        '25': '0.25',
        '85': '0.85',
      },

      // Transition properties for smooth interactions
      transitionProperty: {
        'shadow': 'box-shadow',
        'transform-shadow': 'transform, box-shadow',
      },

      // Z-index for layering
      zIndex: {
        '15': '15',
        '25': '25',
      },

      // Backdrop blur for glassmorphism
      backdropBlur: {
        'xs': '2px',
      },
    },
  },

  // Plugins for additional functionality
  plugins: [
    require('@tailwindcss/typography'), // For prose styling if needed
    require('@tailwindcss/forms'),      // For form control enhancements
    require('tailwindcss-animate'),     // For animation utilities
    function ({ addUtilities }) {
      // Custom utility for hex borders
      const newUtilities = {
        '.hex-border': {
          'clip-path': 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],

  // Core plugins to disable if needed (none disabled here)
  corePlugins: {
    preflight: true,
  },
};
