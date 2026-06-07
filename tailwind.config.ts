import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        'red-cta': '#CC0000',
        'gray-light': '#F5F5F5',
        'gray-mid': '#888888',
        'blue-acc': '#4A90D9',
        cream: '#C8B89A',
      },
      fontFamily: {
        display: ['var(--font-display)', '"Playfair Display"', 'serif'],
        code: ['var(--font-code)', '"Source Code Pro"', 'monospace'],
        bebas: ['var(--font-bebas)', '"Bebas Neue"', 'sans-serif'],
      },
      borderRadius: {
        cta: '3px',
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'fade-up': 'fadeUp 0.7s ease forwards',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
