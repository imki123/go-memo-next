export function initGoogle(login, afterLogin) {
  // NOTE: login, afterLogin 콜백을 받아서 구글 로그인 및 로그인 후 콜백 처리. _app.tsx에서 호출
  window.google?.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    // 로그인 콜백
    callback: (response) => {
      login?.(response.credential, afterLogin)
    },
  })

  window.isInitGoogle = true
}

export function renderGoogleButton(divId) {
  // 구글로그인 버튼, 원버튼 렌더링하기
  function startRender() {
    const google = window.google

    google.accounts.id.renderButton(
      document.getElementById(divId),
      { theme: 'outline', size: 'large' } // customization attributes
    )

    google.accounts.id.prompt() // also display the One Tap dialog
  }

  if (window.isInitGoogle) {
    // init 완료후에 렌더하기
    startRender()
  } else {
    let timeoutId

    let intervalId = setInterval(() => {
      // 구글 초기화 완료될때까지 인터벌 돌려서 렌더하기
      if (window.isInitGoogle) {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        startRender()
      }
    }, 300)

    timeoutId = setTimeout(() => {
      // 10초 후에는 항상 인터벌 종료
      clearInterval(intervalId)
    }, 1000 * 10)
  }
}
