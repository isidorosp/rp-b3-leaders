const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')


module.exports = {
  theme: {
    colors: {
      ...defaultTheme.colors,
      gray: colors.trueGray
    },
    fontFamily: {
      'montserrat': ['Montserrat'],
      'firacode': ['"Fira Code"'],
      sans: ['"Fira Code"', ...defaultTheme.fontFamily.sans],
      serif: ['"Fira Code"', ...defaultTheme.fontFamily.serif],
      mono: ['"Fira Code"', ...defaultTheme.fontFamily.mono]
    },
    extend: {}
  },
  variants: {},
  plugins: [],
  purge: {
    // Filenames to scan for classes
    content: [
      './src/**/*.html',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/**/*.ts',
      './src/**/*.tsx',
      './public/index.html',
    ],
    // Options passed to PurgeCSS
    options: {
      // Whitelist specific selectors by name
      // safelist: [],
    },
  },
}
