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
        himalaya: {
          dark: '#0e1813',
          card: '#16251e',
          border: '#243b30',
          forest: '#1f4832',
          pine: '#2f6b4a',
          emerald: '#3ea873',
          tea: '#e5a93c',
          amber: '#f4b84b',
          terracotta: '#d4653a',
          rust: '#bf4b20',
          mist: '#8aa396',
          snow: '#f2f7f4'
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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

