export const isClient = typeof window !== 'undefined'

export const addSnackBar = (
  message: string,
  duration = 2000,
  animationTime = 500
) => {
  const snackBar = document.createElement('div')
  const defaultStyle = `
    position: fixed;
    z-index: 999;
    bottom: -40px;
    left: 50%;
    transform: translate(-50%);
    opacity: 0;
    background: #777;
    color: white;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 14px;
    transition: bottom ${animationTime}ms, opacity ${animationTime}ms;
  `
  snackBar.style.cssText = defaultStyle
  snackBar.innerHTML = message
  document.body.appendChild(snackBar)
  setTimeout(() => {
    snackBar.style.cssText =
      defaultStyle +
      `
    bottom: 20px;
    opacity: 0.9;
    `
  }, 100)
  setTimeout(() => {
    snackBar.style.cssText = defaultStyle
  }, duration)
  setTimeout(() => {
    if (snackBar) snackBar.remove()
  }, duration + animationTime)
}
