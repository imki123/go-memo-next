/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.{js,ts,jsx,tsx,mdx}',
    '!./node_modules/**',
    '!./out/**',
    '!./.next/**',
    '!./.git/**',
    '!./.vscode/**',
    '!./.idea/**',
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
    },
  },
  plugins: [],
}
