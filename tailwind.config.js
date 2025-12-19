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
        'color-text-1': 'var(--color-text-1)',
        'color-text-2': 'var(--color-text-2)',
        'color-foreground': 'var(--color-foreground)',
        'color-foreground-accent': 'var(--color-foreground-accent)',
        'color-foreground-accent-2': 'var(--color-foreground-accent-2)',
        'color-foreground-accent-3': 'var(--color-foreground-accent-3)',
        'color-foreground-accent-4': 'var(--color-foreground-accent-4)',
        'color-foreground-accent-5': 'var(--color-foreground-accent-5)',
        'color-background-4': 'var(--color-background-4)',
        'color-background-3': 'var(--color-background-3)',
        'color-background-2': 'var(--color-background-2)',
        'color-background-1': 'var(--color-background-1)',
        'cb-red-400': 'var(--cb-red-400)',
        'cb-red-500': 'var(--cb-red-500)',
        'cyborg-red': 'var(--cyborg-red)',
        'cyborg-green': 'var(--cyborg-green)',
        'cyborg-yellow': 'var(--cyborg-yellow)',
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
