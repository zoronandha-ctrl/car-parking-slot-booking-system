/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b8c9ff',
          400: '#91a8ff',
          500: '#667eea',
          600: '#5568d3',
          700: '#4553b8',
          800: '#37449e',
          900: '#2d3785',
        }
      }
    },
  },
  plugins: [],
}
