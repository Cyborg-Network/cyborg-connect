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
      animation: {
        'sidebar-on': 'toggleSidebar 1s ease-in-out 0s 1 normal',
        'menu-on': 'shiftSidebarButton 1s ease-in-out 0s 1 normal',
        'sidebar-off': 'toggleSidebar 1s ease-in-out 0s 1 reverse',
        'menu-off': 'shiftSidebarButton 1s ease-in-out 0s 1 reverse',
      },
      keyframes: {
        toggleSidebar: {
          '0%': { left: '-20rem' },
          '100%': { left: '0rem' },
        },
        shiftSidebarButton: {
          '0%': { left: '5rem' },
          '100%': { left: '70rem' },
        }
      }
    },
  },
  plugins: [],
}
