/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          accent: '#06B6D4',
        },
        surface: {
          page: '#0F172A',
          card: '#1E293B',
        },
        type: {
          feature: '#10B981',
          bug: '#EF4444',
        },
        due: {
          safe: '#10B981',
          warning: '#F59E0B',
          overdue: '#EF4444',
          neutral: '#64748B',
        },
      },
    },
  },
  plugins: [],
};