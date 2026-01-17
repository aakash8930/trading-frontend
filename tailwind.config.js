/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e27',
          card: '#131835',
          border: '#1e2337',
          hover: '#1a1f3a',
        },
      },
    },
  },
  plugins: [],
}
