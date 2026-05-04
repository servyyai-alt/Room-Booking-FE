/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f0',
          100: '#fbe5d9',
          200: '#f6c9b0',
          300: '#f0a67f',
          400: '#e87a4d',
          500: '#e05a27',
          600: '#c9441c',
          700: '#a73318',
          800: '#892a19',
          900: '#71261a',
        },
        gold: {
          400: '#d4a853',
          500: '#c49a3c',
          600: '#a67c2e',
        },
        dark: {
          900: '#0f0e0c',
          800: '#1a1814',
          700: '#262420',
          600: '#33302a',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        warm: '0 4px 24px rgba(224, 90, 39, 0.15)',
        card: '0 2px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
