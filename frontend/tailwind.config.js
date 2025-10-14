/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#1A1A1A',
        'text': '#F5F5F5',
        'point': '#3B82F6',
        'warning': '#F87171',
        'subtle': '#404040',
      }
    },
  },
  plugins: [],
}
