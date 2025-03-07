// postcss.config.js
module.exports = {
  plugins: {
    // Tailwind CSS integration
    'tailwindcss': {},

    // Autoprefixer for vendor prefixes
    'autoprefixer': {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
      ],
      grid: true, // Enable grid prefixes for modern layouts
    },

    // PostCSS Preset Env for modern CSS features
    'postcss-preset-env': {
      stage: 2, // Balance between stable and cutting-edge features
      features: {
        'nesting-rules': true, // Enable CSS nesting
        'custom-media-queries': true, // Support @custom-media
        'color-function': true, // Modern color functions like rgb()
      },
      autoprefixer: false, // Avoid duplicate prefixing
    },

    // CSSNano for production minification
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: [
        'default',
        {
          discardComments: { removeAll: true }, // Strip all comments
          normalizeWhitespace: true, // Compress whitespace
          minifySelectors: true, // Optimize selectors
          mergeRules: true, // Combine similar rules
        },
      ],
    } : false,

    // PostCSS Custom Properties for variable fallback
    'postcss-custom-properties': {
      preserve: true, // Keep original custom properties alongside fallbacks
      warnings: false, // Suppress warnings for better dev experience
    },

    // PostCSS Glitch Effect (custom plugin example)
    'postcss-glitch-effect': {
      // Custom plugin to add glitchy CSS transformations
      glitchClasses: ['glitch-text', 'glitched-line'],
      intensity: 2, // Controls glitch offset in pixels
    },
  },
};
