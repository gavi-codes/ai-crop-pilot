/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        field: {
          light: '#eef2f3',
          dark: '#1e293b',
          accent: '#10b981',
          ledger: '#f8fafc',
          text: '#334155'
        }
      }
    },
  },
  plugins: [],
}
