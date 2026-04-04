/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#a78bfa',
          'purple-light': '#c4b5fd',
          'purple-dark': '#8b5cf6',
          blue: '#60a5fa',
          'blue-dark': '#3b82f6',
          green: '#34d399',
          'green-dark': '#10b981',
          orange: '#fb923c',
          'orange-dark': '#f97316',
          red: '#f87171',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          secondary: '#1a1a2e',
          card: 'rgba(255,255,255,0.04)',
          'card-border': 'rgba(255,255,255,0.08)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #a78bfa, #60a5fa)',
        'gradient-green': 'linear-gradient(135deg, #34d399, #10b981)',
        'gradient-orange': 'linear-gradient(135deg, #fb923c, #f97316)',
        'gradient-page': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'float-reverse': 'float 10s ease-in-out infinite reverse',
        pulse: 'pulse 2s ease-in-out infinite',
        'dot-appear': 'dotAppear 0.2s ease',
        shine: 'shine 0.8s ease-in-out',
        'border-shine': 'border-shine 1.2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        dotAppear: {
          from: { transform: 'scale(0)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'border-shine': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
