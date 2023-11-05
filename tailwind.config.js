/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000',
      },
      fontFamily: {
        sans: [
          'Poppins-Regular',
          'Poppins-Light',
          'Poppins-SemiBold',
          'Poppins-Medium',
        ],
        'sans-bold': ['Poppins-Bold', 'Poppins-ExtraBold'],
      },
    },
  },
  plugins: [],
};
