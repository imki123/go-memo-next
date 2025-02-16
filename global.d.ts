declare global {
  interface Window {
    google: unknown
  }
}
export const google = window.google
