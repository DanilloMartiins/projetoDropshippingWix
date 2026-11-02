/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080C14',
          card: '#0F1626',
          border: '#1E293B',
          cyan: '#00E5FF',
          blue: '#2563EB',
          purple: '#7C3AED',
          accent: '#06B6D4'
        }
      }
    },
  },
  plugins: [],
}


