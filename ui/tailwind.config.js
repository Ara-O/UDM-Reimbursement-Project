/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme:
  {
    extend: {
      colors: {
        "udmercy-blue": "#002d72",
        "udmercy-red": "#a5093e"
      }
    },
  },
  corePlugins: {
    preflight: false
  },
  plugins: [],
}