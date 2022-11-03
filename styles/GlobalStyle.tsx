import { css, Global } from '@emotion/react'
import OpenColor from 'open-color'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          font-size: 16px;
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
          @media (min-width: 800px) {
            min-height: 100vh;
            max-width: 800px;
            margin: auto;
            background: white;
          }
        }
      `}
    />
  )
}
