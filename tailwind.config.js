/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rais: {
          dark: '#081026',
          card: '#0f1c3f',
          cardHover: '#13234d',
          border: 'rgba(56, 189, 248, 0.2)',
          cyan: '#00d2ff',
          cyanLight: '#67e8f9',
          cyanDark: '#0284c7',
          gold: '#E5B842',
          goldLight: '#FDE047',
          goldMuted: '#A17E24',
          ice: '#38BDF8',
          surface: '#F8FAFC',
          surfaceDark: '#081026'
        }
      },
      fontFamily: {
        serif: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
