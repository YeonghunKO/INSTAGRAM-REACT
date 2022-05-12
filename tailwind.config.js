const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  important: true,
  content: ['./src/**/*.{html,js}'],
  theme: {
    screens: {
      xs: { max: '600px' },
      ...defaultTheme.screens,
    },
    fill: theme => ({
      red: theme('colors.red.primary'),
    }),

    colors: {
      white: '#ffffff',
      blue: {
        medium: '#005c98',
      },
      black: {
        light: '#262626',
        faded: '#00000059',
      },
      gray: {
        base: '#616161',
        background: '#fafafa',
        primary: '#dbdbdb',
      },
      red: {
        primary: '#ed4956',
      },
    },

    extend: {
      extend: {
        display: ['group-hover'],
      },
    },
  },

  plugins: [],
};
