/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Geist', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Doto', '"Geist Mono"', 'monospace'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        void: '#050505',
        ink: '#f4f1ec',
        molten: '#ff3d1f',
        ember: '#ff7a35',
        peach: '#ffb59a',
        cobalt: '#3358ff',
      },
    },
  },
  plugins: [],
}
