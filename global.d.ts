declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          renderButton: (
            element: HTMLElement | null,
            options: { theme: string; size: string }
          ) => void
          prompt: () => void
        }
      }
    }
    isInitGoogle: boolean
  }
}
export const google = window.google
