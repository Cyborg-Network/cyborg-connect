/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glass-shadow': '0 4px 30px rgba(0, 0, 0, 0.1);'
      },
      colors: {
        'cb-green': 'var(--cb-green)',
        'cb-gray-400': 'var(--cb-gray-400)',
        'cb-gray-500': 'var(--cb-gray-500)',
        'cb-gray-600': 'var(--cb-gray-600)',
        'cb-gray-700': 'var(--cb-gray-700)',
        'cb-red-400': 'var(--cb-red-400)',
        'cb-red-500': 'var(--cb-red-500)',
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
        },
      },
      spacing: {
        'burger-btn-offset': 'var(--burger-btn-offset)'
      }
    },
  },
  plugins: [],
}
