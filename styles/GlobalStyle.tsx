import { css, Global } from '@emotion/react'

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
        }
      `}
    />
  )
}
