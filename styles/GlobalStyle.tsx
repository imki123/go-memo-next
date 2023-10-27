import 'pretendard/dist/web/variable/pretendardvariable.css'

import { Global, css } from '@emotion/react'
import OpenColor from 'open-color'
import { useEffect } from 'react'

import { useThemeStore } from '../zustand'

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

// 애니메이션 설정
const setSkeleton = () =>
  css`
    @keyframes skeleton {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
      100% {
        opacity: 1;
      }
    }
  `

// 다크 테마 설정
const setDarkTheme = (theme?: 'dark') =>
  theme === 'dark'
    ? css`
        html,
        body {
          background: ${OpenColor.gray[9]};
          color: ${OpenColor.gray[3]};
        }
      `
    : ''

export default function GlobalStyle() {
  // 로컬 테마
  const { theme: storeTheme, set: setStoreTheme } = useThemeStore()

  // meta theme-color 변경하는 함수
  function setMetaThemeColor(color: string) {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.querySelector('meta[name=theme-color]')?.remove()
    document.head?.appendChild(meta)
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem('go-memo-next-theme') as
      | 'dark'
      | undefined
    setStoreTheme(localTheme)
    setMetaThemeColor(localTheme === 'dark' ? OpenColor.gray[9] : 'white')
  }, [setStoreTheme])

  useEffect(() => {
    setMetaThemeColor(storeTheme === 'dark' ? OpenColor.gray[9] : 'white')
  }, [storeTheme])

  return (
    <Global
      styles={css`
        ${setSkeleton()}
        * {
          font-family: 'Pretendard Variable', Pretendard, -apple-system,
            BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI',
            'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic',
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;

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
          min-height: 100%;
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
        ${setDarkTheme(storeTheme)}
      `}
    />
  )
}
