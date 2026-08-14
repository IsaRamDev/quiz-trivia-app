/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        display: ['"Lexend"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        quiz: {
          bg:      '#0e0b2e',
          surface: '#1a1650',
          card:    '#231f6e',
          border:  '#3730a3',
        },
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.35s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
        'bounce-in':   'bounceIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        'timer-drain': 'timerDrain linear forwards',
        'shake':       'shake 0.4s ease-out',
        'pulse-fast':  'pulse 0.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                                to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.9)' },       to: { opacity: 1, transform: 'scale(1)' } },
        bounceIn:  { from: { opacity: 0, transform: 'scale(0.7)' },       to: { opacity: 1, transform: 'scale(1)' } },
        timerDrain:{ from: { width: '100%' },                             to: { width: '0%' } },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%':     { transform: 'translateX(-6px)' },
          '40%':     { transform: 'translateX(6px)' },
          '60%':     { transform: 'translateX(-4px)' },
          '80%':     { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
