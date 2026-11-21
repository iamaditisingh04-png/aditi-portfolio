/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, index) => [index, String(index / 100)]),
      ),
      colors: {
        forest: '#315C3B',
        'forest-deep': '#22422C',
        leaf: '#78A85B',
        lime: '#B5CF78',
        sky: '#69B6E8',
        turquoise: '#42BDB0',
        cream: '#FFF2D8',
        parchment: '#FFF8E8',
        terracotta: '#C97850',
        blush: '#E9A5AE',
        sun: '#F5CD68',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        petal: '0 24px 70px -30px rgba(34, 66, 44, 0.55)',
        glow: '0 0 60px -10px rgba(245, 205, 104, 0.55)',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(12px,-14px,0) rotate(8deg)' },
          '100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.75' },
        },
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        bob: 'bob 5s ease-in-out infinite',
        'fade-up': 'fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
