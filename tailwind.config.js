/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          navy: '#2D3250',
          slate: '#7077A1',
          amber: '#F6B17A',
          lavender: '#E2C4F0',
          sage: '#A8D5BA',
          cream: '#F9F3EE',
        },
        hr: { light: '#E6F1FB', mid: '#378ADD', dark: '#185FA5' },
        manager: { light: '#EEEDFE', mid: '#7077A1', dark: '#2D3250' },
        hire: { light: '#E1F5EE', mid: '#1D9E75', dark: '#0F6E56' },
        compass: { light: '#F3F0FE', mid: '#6C5CE7', dark: '#4830C4' },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(45, 50, 80, 0.08)',
        lift: '0 12px 40px -12px rgba(45, 50, 80, 0.22)',
        glow: '0 0 0 4px rgba(108, 92, 231, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(29, 158, 117, 0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(29, 158, 117, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(29, 158, 117, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(0) rotateZ(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120px) rotateZ(360deg)', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-ring': 'pulseRing 2s infinite',
        shimmer: 'shimmer 2s infinite linear',
        'confetti-fall': 'confettiFall 1s ease-out forwards',
        blink: 'blink 1.2s infinite',
      },
    },
  },
  plugins: [],
};
