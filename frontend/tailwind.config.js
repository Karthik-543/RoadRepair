/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#1e3a8a',
          accent: '#2563eb',
          light: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
          border: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
}
