/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
        display: ['Playfair Display', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        soft: '0 20px 40px rgba(15, 23, 42, 0.08)',
        strong: '0 30px 60px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
