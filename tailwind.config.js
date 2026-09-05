/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Modern Himalayan Heritage Tokens
        'pine-deep': '#064e3b',
        'pine-mist': '#065f46',
        'pine-dark': '#07150e',
        'rail-gold': '#d97706',
        'amber-glow': '#f59e0b',
        'tertiary': '#ffb95f',
        'parchment': '#fdfbf7',
        'iron-smoke': '#1f2937',
        'surface-container': '#1f201e',
        'surface-container-low': '#1b1c1a',
        'surface-container-lowest': '#0e0e0d',
        'surface-container-high': '#2a2a28',
        'surface-dim': '#131412',
        
        // Himalayan theme palette
        himalaya: {
          dark: '#070e0a',
          surface: '#0d1913',
          card: '#13251c',
          'card-hover': '#182f24',
          border: '#1e3b2c',
          'border-glow': '#2e5b44',
          forest: '#1f4832',
          pine: '#2a5d40',
          emerald: '#10b981',
          mint: '#34d399',
          tea: '#e5a93c',
          amber: '#f5b942',
          gold: '#fbbf24',
          terracotta: '#e06d44',
          rust: '#bf4b20',
          mist: '#94a399',
          snow: '#f8fafc'
        },
        sunlight: {
          bg: '#ffffff',
          surface: '#f4f4f5',
          border: '#000000',
          text: '#000000',
          accent: '#b91c1c'
        }
      },
      fontFamily: {
        serif: ['"Libre Caslon Text"', 'Georgia', 'serif'],
        headline: ['"Libre Caslon Text"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Libre Caslon Text"', 'Outfit', '"Plus Jakarta Sans"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px 2px rgba(245, 158, 11, 0.45)',
        'glow-gold': '0 0 22px 2px rgba(217, 119, 6, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-gold': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(217, 119, 6, 0.25)',
        'glass-lg': '0 20px 50px -15px rgba(0, 0, 0, 0.7)',
        'card-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(46, 91, 68, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
