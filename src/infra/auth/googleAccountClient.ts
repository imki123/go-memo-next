const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

checkGoogleClientId()

function checkGoogleClientId() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set')
  }
}

export type GoogleAccountClient = {
  autoLogin(callback: (response: { credential: string }) => Promise<void>): void
  renderLoginUi(divId: string): void
}

export const googleAccountClient: GoogleAccountClient = {
  autoLogin: (callback) => {
    // NOTE: 스토리지에 저장되어있는 정보를 이용해서 자동으로 callback 을 처리한다.
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback,
    })
    window.isInitGoogle = true
  },

  renderLoginUi: (divId) => {
    if (window.isInitGoogle) {
      renderGoogleLoginButtonAndPromptUi(divId)
    } else {
      // NOTE: isInitGoogle 완료될때까지 인터벌
      let timeoutId: NodeJS.Timer | undefined = undefined

      const intervalId = setInterval(() => {
        if (window.isInitGoogle) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
          renderGoogleLoginButtonAndPromptUi(divId)
        }
      }, 300)

      timeoutId = setTimeout(() => {
        // NOTE: 10초 후에는 항상 인터벌 종료하는 방어코드
        clearInterval(intervalId)
        if (!window.isInitGoogle) {
          throw new Error('Google account client is not initialized')
        }
      }, 1000 * 10)
    }
  },
}

function renderGoogleLoginButtonAndPromptUi(divId: string) {
  // 구글로그인 버튼, 원버튼 ui 렌더링
  const google = window.google

  google.accounts.id.renderButton(
    document.getElementById(divId),
    { theme: 'outline', size: 'large' } // customization attributes
  )

  google.accounts.id.prompt() // also display the One Tap dialog
}
