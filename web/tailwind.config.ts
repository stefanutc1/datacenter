import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--theme-bg)',
          card: 'var(--theme-card)',
          cardHover: 'var(--theme-card-hover)',
          border: 'var(--theme-border)',
          primary: 'var(--theme-primary)',
          secondary: 'var(--theme-secondary)',
          muted: 'var(--theme-muted)',
          accent: 'var(--theme-accent)',
        },
        obsidian: {
          950: '#08090b',
          900: '#0c0e11',
          850: '#121519',
          800: '#181b21',
          750: '#1e232b',
          700: '#262c37',
          600: '#353e4d',
          500: '#4c586d',
        },
        emerald: {
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        copper: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        serif: ['"tiempos"', '"Tiempos Headline"', '"Newsreader"', '"Lora"', 'Georgia', 'serif'],
        sans: ['Geist', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Space Mono"', 'ui-monospace', 'monospace'],
        display: ['"tiempos"', '"Tiempos Headline"', '"Newsreader"', '"Lora"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
