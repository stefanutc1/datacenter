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
          700: '#523e2c',
          800: '#32251a',
          900: '#1e160e',
          950: '#140f09',
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
        },
        amber: {
          warm: '#d4973b',
        },
        sage: {
          warm: '#6e9e75',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
