export const initGoogle = (login, afterLogin) => {
  const google = window.google
  google.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    // 로그인 콜백
    callback: (response) => {
      // console.info('login succeess', response)
      login?.(response.credential, afterLogin)
    },
  })
  window.isInitGoogle = true
}

// 구글로그인 버튼, 원버튼 렌더링하기
export const renderGoogleButton = (divId) => {
  const startRender = () => {
    const google = window.google
    google.accounts.id.renderButton(
      document.getElementById(divId),
      { theme: 'outline', size: 'large' } // customization attributes
    )
    google.accounts.id.prompt() // also display the One Tap dialog
  }

  // init 완료후에 렌더하기
  if (window.isInitGoogle) {
    startRender()
  } else {
    let timeoutId
    let intervalId = setInterval(() => {
      if (window.isInitGoogle) {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        startRender()
      }
    }, 300)
    // 10초 후에는 항상 인터벌 종료
    timeoutId = setTimeout(() => {
      clearInterval(intervalId)
    }, 1000 * 10)
  }
}
