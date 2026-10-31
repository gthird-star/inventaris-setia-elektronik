/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary900: '#17377A',
        primary800: '#1E438F',
        primary600: '#3267D5',
        primary100: '#E8F0FF',
        background: '#F6F8FC',
        surface: '#FFFFFF',
        text: '#182230',
        textMuted: '#667085',
        border: '#E3E8EF',
        success: '#16834A',
        successBg: '#DDF8E7',
        warning: '#9A6700',
        warningBg: '#FFF0C2',
        danger: '#B42318',
        dangerBg: '#FEE4E2',
        info: '#2457B2',
        infoBg: '#E1ECFF',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
};
