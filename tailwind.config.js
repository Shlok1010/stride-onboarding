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
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(16, 24, 40, 0.08)',
        lift: '0 12px 40px -12px rgba(16, 24, 40, 0.22)',
        glow: '0 0 0 4px rgba(16, 185, 129, 0.12)',
        card: '0 1px 2px 0 rgb(16 24 40 / 0.05), 0 1px 3px 0 rgb(16 24 40 / 0.04)',
        cardHover: '0 4px 12px -2px rgb(16 24 40 / 0.08), 0 2px 4px -1px rgb(16 24 40 / 0.04)',
        pop: '0 12px 32px -8px rgb(16 24 40 / 0.14), 0 4px 12px -4px rgb(16 24 40 / 0.06)',
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
