/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'sans-serif',
        ],
      },
      colors: {
        // OpenColor 색상 팔레트를 Tailwind에 추가
        gray: {
          0: '#f8f9fa',
          1: '#f1f3f4',
          2: '#e9ecef',
          3: '#dee2e6',
          4: '#ced4da',
          5: '#adb5bd',
          6: '#868e96',
          7: '#495057',
          8: '#343a40',
          9: '#212529',
        },
        blue: {
          0: '#e3f2fd',
          1: '#bbdefb',
          2: '#90caf9',
          3: '#64b5f6',
          4: '#42a5f5',
          5: '#2196f3',
          6: '#1e88e5',
          7: '#1976d2',
          8: '#1565c0',
          9: '#0d47a1',
        },
        yellow: {
          0: '#fffde7',
          1: '#fff9c4',
          2: '#fff59d',
          3: '#fff176',
          4: '#ffee58',
          5: '#ffeb3b',
          6: '#fdd835',
          7: '#fbc02d',
          8: '#f9a825',
          9: '#f57f17',
        },
      },
      maxWidth: {
        custom: '800px',
      },
      height: {
        header: '60px',
      },
    },
  },
  plugins: [],
}
