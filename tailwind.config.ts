import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        cinema: {
          black: '#080810',
          dark: '#0e0e1a',
          card: '#13131f',
          border: '#1e1e30',
          gold: '#f5c518',
          'gold-dim': '#c9a114',
          accent: '#e8622a',
          'accent-dim': '#c45220',
          positive: '#22c55e',
          mixed: '#f59e0b',
          negative: '#ef4444',
          muted: '#6b6b8a',
          light: '#c8c8e0',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gauge-fill': {
          '0%': { 'stroke-dashoffset': '251' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        'slide-in-left': 'slide-in-left 0.5s ease forwards',
        'scale-in': 'scale-in 0.5s ease forwards',
        shimmer: 'shimmer 2s infinite linear',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
