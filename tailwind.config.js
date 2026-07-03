/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Kanit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0C0C0C',
        paper: '#D7E2EA',
        electric: '#2E6BFF',
        'electric-glow': '#6FA0FF',
      },
    },
  },
  plugins: [],
};
