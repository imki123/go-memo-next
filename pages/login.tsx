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

        <div className='flex flex-col text-sm gap-4'>
          <div>서버가 재시작될 경우 1분 정도 소요될 수 있습니다.</div>

          {isLoggingIn && <div>로그인 중... {secondsToLogin}초</div>}
        </div>
      </div>
    </>
  )
}
