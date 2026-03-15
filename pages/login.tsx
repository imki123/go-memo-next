import { useEffect } from 'react'

import { authService } from '@/domain/auth/di'
import { useLoginStore } from '@/infra/store/useLoginStore'
import Header from '@/shared/components/Header'
import { texts } from '@/shared/constants/texts'


export default function LoginPage() {
  useEffect(() => {
    authService.renderLoginUi('googleLoginDiv')
  }, [])

  const { isLoggingIn, secondsToLogin } = useLoginStore()

  return (
    <>
      <Header title='고영이 메모장🐈' backButton={true} rightItems={[]} />

      <div className='flex flex-col items-center justify-center gap-4 mt-4'>
        <div id='googleLoginDiv'></div>

        <div className='flex flex-col text-sm gap-4'>
          <div>{texts.serverRestarting}</div>

          {isLoggingIn && <div>로그인 중... {secondsToLogin}초</div>}
        </div>
      </div>
    </>
  )
}
