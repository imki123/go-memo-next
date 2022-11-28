import { css, Global } from '@emotion/react'
import OpenColor from 'open-color'

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
