import { css, Global } from '@emotion/react'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        html,
        body {
          margin: 0;
          padding: 0;
        }
      `}
    />
  )
}
