import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dp: {
          red: '#C8102E',
          'red-dark': '#9A0B22',
          'red-light': '#E8173F',
          gold: '#D4AF37',
          'gold-light': '#F0D060',
          navy: '#1A1A2E',
          'navy-mid': '#16213E',
          'navy-light': '#0F3460',
          cream: '#FFF8F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        heading: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #9A0B22 50%, #C8102E 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(26,26,46,0.95) 0%, rgba(154,11,34,0.85) 100%)',
        'gold-gradient': 'linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'dp': '0 4px 20px rgba(200, 16, 46, 0.3)',
        'dp-lg': '0 8px 40px rgba(200, 16, 46, 0.4)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
