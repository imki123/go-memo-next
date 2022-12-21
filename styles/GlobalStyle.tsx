import { Global, css } from '@emotion/react'
import OpenColor from 'open-color'

// 헤더 높이
export const HEADER_HEIGHT = 60
// 최대 너비
export const MAX_WIDTH = 800

// 드래그, 선택 막아주는 스타일
export const noSelect = css`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

// media 유틸
export const mediaBiggerThan = (
  size: number,
  css: string,
  isBigger = true,
  isWidth = true
) => {
  let mediaType = 'min-width'
  if (isBigger && !isWidth) mediaType = 'min-height'
  else if (!isBigger && isWidth) mediaType = 'max-width'
  else if (!isBigger && !isWidth) mediaType = 'max-height'
  return `
    @media (${mediaType}: ${size}px) {
      ${css};
    }
  `
}

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          ::-webkit-scrollbar {
            width: 5px;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb {
            background: ${OpenColor.yellow[5]};
            border-radius: 3px;
          }
        }
        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          position: relative;
          scroll-behavior: smooth;
        }
        html {
          ${mediaBiggerThan(
            MAX_WIDTH,
            `
              background: ${OpenColor.blue[0]};
            `
          )}
        }
        body,
        button,
        textarea {
          font-size: 14px;
        }
        body {
          scroll-behavior: smooth;
          width: 100vw;
          overflow-x: hidden;
          ${mediaBiggerThan(
            MAX_WIDTH,
            `min-height: 100vh;
              max-width: ${MAX_WIDTH}px;
              margin: auto;
              background: white;
            `
          )}
        }
        a {
          text-decoration: underline;
          color: ${OpenColor.blue[7]};
          font-size: inherit;
        }
        button,
        a {
          cursor: pointer;
        }
        button,
        img {
          ${noSelect}
        }
      `}
    />
  )
}
