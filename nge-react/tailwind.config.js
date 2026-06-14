/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:   '#0a0a0a',
        paper: '#f2f0ea',
        cy:    '#00e5ff',
        lime:  '#b8ff57',
        gold:  '#c8a96e',
        dim:   '#3a3a3a',
        fog:   '#888888',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        mono:  ['"Space Mono"', 'monospace'],
        sans:  ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tight2:   '-0.03em',
        tag:      '0.25em',
        wide2:    '0.18em',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
}
