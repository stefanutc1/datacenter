/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: 'var(--warm-bg)',
          card: 'var(--warm-card)',
          hover: 'var(--warm-hover)',
          border: 'var(--warm-border)',
          primary: 'var(--warm-primary)',
          secondary: 'var(--warm-secondary)',
          muted: 'var(--warm-muted)',
        },
        terracotta: {
          400: '#e07a4a',
          500: '#d06332',
          600: '#b84e20',
          700: '#943b15',
        },
        clay: {
          100: '#f8f4ed',
          200: '#ede4d3',
          300: '#decbb4',
          400: '#be9e7f',
          500: '#9b7b5d',
          700: '#473627',
          800: '#2b2016',
          850: '#221911',
          900: '#1a130d',
          950: '#120e09',
        },
        sand: {
          50: '#faf8f5',
          100: '#f3ece1',
          200: '#e5d9c6',
          300: '#d4c2a7',
          400: '#bca17e',
          500: '#a3845f',
          800: '#4a3a29',
          900: '#2b2116',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
