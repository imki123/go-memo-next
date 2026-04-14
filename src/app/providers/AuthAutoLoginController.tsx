import { useRouter } from 'next/router'
import Script from 'next/script'
import { useCallback } from 'react'
import { toast } from 'sonner'

import { LoginResponseType } from '@/apis/userApi'
import { routePaths } from '@/app/routePaths'
import { useAuthService } from '@/domain/auth/hook'
import { useLockStore } from '@/infra/store/useLockStore'

export function AuthAutoLoginController() {
  const router = useRouter()
  const {
    action: { autoLogin },
  } = useAuthService()

  const afterLogin = useCallback(
    (loginData: LoginResponseType) => {
      if (loginData.token) {
        toast.success('로그인 성공 😄')
        useLockStore.getState().setIsLockedLocal(false)
        router.replace(routePaths.root)
        return
      }

      toast.error('로그인 실패 😥')
    },
    [router]
  )

  return (
    <Script
      src='https://accounts.google.com/gsi/client'
      onLoad={() => {
        void autoLogin(afterLogin)
      }}
    />
  )
}
