/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      spacing: {
        'leftbarClosed': '6rem',
        'leftbarOpened': '18rem',
        'headerHeight': '4rem',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  safelist: [
    {pattern: /grid-cols-([123456789])/},
    {pattern: /text-(red|green|blue|yellow|orange|purple|pink)-500/},
    {pattern: /bg-(red|green|blue|yellow|orange|purple|pink)-400/},
    {pattern: /bg-(red|green|blue|yellow|orange|purple|pink)-100/}
  ],
}
