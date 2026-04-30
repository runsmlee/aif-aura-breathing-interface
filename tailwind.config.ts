import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        calm: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'pulse-ring': 'pulseRing 3s ease-in-out infinite',
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-in-up': 'fadeInUp 500ms ease-out',
        'breathe-in': 'breatheIn 4s ease-in-out forwards',
        'breathe-out': 'breatheOut 4s ease-in-out forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.1)', opacity: '0.6' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breatheIn: {
          '0%': { transform: 'scale(0.4)' },
          '100%': { transform: 'scale(1)' },
        },
        breatheOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.4)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(239, 68, 68, 0.15)',
        'glow-md': '0 0 30px rgba(239, 68, 68, 0.2)',
        'glow-lg': '0 0 60px rgba(239, 68, 68, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
