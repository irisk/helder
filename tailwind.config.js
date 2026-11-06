/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        offwhite: '#FAF8F3',
        cream: '#FFFDF7',
        wash: '#F0EDE4',
        ink: { DEFAULT: '#12214A', soft: '#3A4668', faint: '#7A8299' },
        cobalt: { DEFAULT: '#1D4AE5', deep: '#163DB8', soft: '#DDE5FB' },
        yellow: { DEFAULT: '#F2C200', soft: '#FAE88F' },
        coral: { DEFAULT: '#E8563F', deep: '#C8402B', soft: '#F6CFC6' },
        sage: { DEFAULT: '#6AB8A2', deep: '#4C9B85', soft: '#D6EBE3' },
        // ook in colors, niet alleen in borderColor: anders is bg-rule een stille no-op
        rule: 'rgba(18,33,74,0.14)',
      },
      borderColor: {
        rule: 'rgba(18,33,74,0.14)',
      },
      boxShadow: {
        s: '0 1px 2px rgba(18,33,74,0.05)',
        m: '0 10px 28px -10px rgba(18,33,74,0.14)',
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
}
