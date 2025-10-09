import { css } from '@emotion/react'

export function Space({
  height = 16,
  width = height,
}: {
  height?: number
  width?: number
}) {
  return (
    <div
      css={css`
        height: ${height}px;
        width: ${width}px;
      `}
    ></div>
  )
}
