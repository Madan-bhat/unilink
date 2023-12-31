/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0c0c0c',
        chatBubbleBg: 'rgba(162, 164, 171, 0.4)',
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
