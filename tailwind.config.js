/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D7377',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#E8A838',
          foreground: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgb(0 0 0 / 0.07), 0 10px 20px -2px rgb(0 0 0 / 0.04)',
        'soft-dark': '0 2px 15px -3px rgb(0 0 0 / 0.2), 0 10px 20px -2px rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [],
}
