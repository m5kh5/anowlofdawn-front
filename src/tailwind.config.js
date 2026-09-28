/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- هذا السطر يخبر تايلوند بقراءة كلاسات App.jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}