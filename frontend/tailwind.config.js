/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'x-blue': '#1DA1F2',
        'x-dark': '#15202B',
        'x-darker': '#192734',
      },
    },
  },
  plugins: [],
}
