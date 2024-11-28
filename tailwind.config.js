/** @type {DefaultColors} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        gray: colors.gray,
        neutral: colors.neutral,
        stone: colors.stone,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.yellow,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
        zinc: colors.zinc
      },
      gridTemplateColumns: {
        // Define a custom grid template named 'custom-cols'
        'timetable': '0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
      },
      gridTemplateRows: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      spacing: {
        'cellHeight': '3rem',
        'sidebarClosed': '4rem',
        'sidebarOpened': '16rem'
        // 'leftbarClosed': '6rem',
        // 'leftbarOpened': '18rem',
        // 'headerHeight': '4rem',
        // 'weekCalendarCellHeight': '50px'
      },
      fontSize: {
        'xxs': '0.5rem'
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  safelist: [
    {pattern: /grid-cols-([123456789])/},
    { pattern: /bg-(slate|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|zinc)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /text-(slate|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|zinc)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /border-(slate|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|zinc)-(50|100|200|300|400|500|600|700|800|900)/ },

  ],
}
