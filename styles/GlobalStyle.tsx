import { Global, css } from '@emotion/react'

import OpenColor from 'open-color'

// 헤더 높이
export const headerHeight = 50

// 드래그, 선택 막아주는 스타일
export const noSelect = css`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          font-size: 14px;
        }
        html,
        body {
          margin: 0;
          padding: 0;
          position: relative;
        }
        html {
          @media (min-width: 800px) {
            background: ${OpenColor.blue[0]};
          }
        }
        body {
          scroll-behavior: smooth;
          width: 100vw;
          overflow-x: hidden;
          padding-bottom: 60px;
          @media (min-width: 800px) {
            min-height: 100vh;
            max-width: 800px;
            margin: auto;
            background: white;
          }
        }
        a {
          text-decoration: underline;
          color: ${OpenColor.blue[7]};
          font-size: inherit;
        }
      `}
    />
  )
}
