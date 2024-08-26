/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cb-green': 'var(--cb-green)',
        'cb-gray-400': 'var(--cb-gray-400)',
        'cb-gray-500': 'var(--cb-gray-500)',
        'cb-gray-600': 'var(--cb-gray-600)',
        'cb-gray-700': 'var(--cb-gray-700)',
        'gauge-red': 'var(--gauge-red)',
        'gauge-green': 'var(--gauge-green)',
        'gauge-yellow': 'var(--gauge-yellow)',
      },
    },
  },
  plugins: [],
}
