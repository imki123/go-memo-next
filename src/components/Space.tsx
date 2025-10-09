export function Space({
  height = 16,
  width = height,
}: {
  height?: number
  width?: number
}) {
  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    ></div>
  )
}
