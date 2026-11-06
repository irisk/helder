/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['Figtree', 'Arial', 'sans-serif'],
      },
      // Each color has one job.
      colors: {
        ground: '#F3F2F8',
        surface: '#FFFFFF',
        shade: '#ECEAF4', // a column nobody has confirmed yet; the vak block on a leerlijn card
        ink: { DEFAULT: '#2A2540', soft: '#5C5870' },
        line: { DEFAULT: '#DCD9E8', soft: '#E9E7F1', strong: '#CBC7DC' },
        field: '#8D88A3',
        action: { DEFAULT: '#3B3F9E', deep: '#2D3080', soft: '#E6E5F7' }, // what you can click
        present: '#2E7F70', // source marks only
        old: '#DFA100', // the dot for an old date, always with the date in text
        overlay: 'rgba(42,37,64,0.2)',
      },
      fontSize: {
        titel: ['26px', { lineHeight: '1.25', fontWeight: '800' }],
        kop: ['20px', { lineHeight: '1.3', fontWeight: '800' }],
        basis: ['15px', '1.45'],
        legenda: ['14px', '1.45'],
        klein: ['13px', '1.4'],
      },
      boxShadow: {
        m: '0 10px 28px -10px rgba(42,37,64,0.14)',
      },
      borderRadius: {
        kaart: '14px',
        kaartje: '10px',
        veld: '8px',
      },
    },
  },
  plugins: [],
}
