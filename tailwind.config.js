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
        ink: '#0A0A0F', // deep near-black with a violet undertone
        surface: '#12121B', // raised panels
        paper: '#E8ECF1', // soft off-white
        electric: '#8B7CF6', // iris violet — primary accent
        'electric-glow': '#B7AFFF',
        neon: '#6FE7F2', // cyan — secondary accent, use sparingly
      },
    },
  },
  plugins: [],
};
