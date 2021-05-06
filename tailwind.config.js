module.exports = {
  purge: [
     './public/**/*.html',
     './public/**/*.js',
     './src/**/*.js',
   ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
