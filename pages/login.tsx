import { useEffect } from 'react'

import { useLoginStore } from '@/zustand/useLoginStore'

import Header from '../src/components/Header'
import { renderGoogleButton } from '../src/utils/googleLogin'

export default function LoginPage() {
  useEffect(() => {
    renderGoogleButton('googleLoginDiv')
  }, [])

  const { isLoggingIn, secondsToLogin } = useLoginStore()

  return (
    <>
      <Header title='고영이 메모장🐈' backButton={true} rightItems={[]} />

      <div className='flex flex-col items-center justify-center gap-4 mt-4'>
        <div id='googleLoginDiv'></div>

        {isLoggingIn && <div>로그인 중... {secondsToLogin}초</div>}

        <div className='flex flex-col text-sm'>
          <div>쿠키 사용이 차단 되어있는 경우 로그인이 불가합니다.</div>

          <div className='[&_span]:!text-blue-500'>
            <span>크롬</span> 또는 <span>사파리</span> 브라우저를 사용해주세요.
            😉
          </div>

          <div>서버가 재시작될 경우 1분 정도 소요될 수 있습니다.</div>
        </div>
      </div>
    </>
  )
}
