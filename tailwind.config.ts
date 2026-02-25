import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          cyan: '#00D4FF',
        },
      },
      backgroundImage: {
        'gradient-solana': 'linear-gradient(135deg, #9945FF 0%, #14F195 50%, #00D4FF 100%)',
      },
      borderRadius: {
        pixel: '0',
        'pixel-sm': '2px',
      },
      boxShadow: {
        pixel: '4px 4px 0 rgba(0,0,0,0.8)',
        'pixel-lg': '6px 6px 0 rgba(0,0,0,0.8)',
        'pixel-press': '2px 2px 0 rgba(0,0,0,0.8)',
        'os-window': '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(153, 69, 255, 0.15)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 0.5s steps(2) infinite',
        'glow': 'glow 1s steps(2) infinite alternate',
        'float-up': 'float-up 0.8s ease-out forwards',
        'slot-flash': 'slot-flash 0.25s ease-out',
        'pop-in': 'pop-in 0.35s ease-out',
        'block-around': 'block-around 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'glow': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.9' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '70%': { opacity: '1', transform: 'translateY(-24px) scale(1.1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1)' },
        },
        'slot-flash': {
          '0%': { boxShadow: '6px 6px 0 rgba(0,0,0,0.9)' },
          '40%': { boxShadow: '0 0 18px 3px rgba(20, 241, 149, 0.6)' },
          '100%': { boxShadow: '6px 6px 0 rgba(0,0,0,0.9)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '60%': { opacity: '1', transform: 'scale(1.15)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'block-around': {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0)', visibility: 'visible' },
          '25%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)', visibility: 'visible' },
          '75%': { opacity: '1', visibility: 'visible' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1.2)', visibility: 'hidden' },
        },
      },
    },
  },
  plugins: [],
}
export default config






