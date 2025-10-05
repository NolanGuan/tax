/**
 * Tailwind CSS configuration file
 * 
 * Configuration for Tailwind CSS v4 with typography plugin
 * Custom colors are defined in globals.css using @theme directive
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fce7dc',
          200: '#f9d0b8',
          300: '#f5b089',
          400: '#f08559',
          500: '#ec4899',
          600: '#d63384',
          700: '#b02a5b',
          800: '#8c2043',
          900: '#661b33',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d1117',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
