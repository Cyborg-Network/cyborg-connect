/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cb-green': '#01DA63',
        'cb-gray-400': '#343735',
        'cb-gray-500': '#2C3631',
        'cb-gray-600': '#1E211F',
        'cb-gray-700': '#151715',
      },
    },
  },
  plugins: [],
}