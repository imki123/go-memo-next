import { isAxiosError } from 'axios'
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
        useLockStore.getState().setIsLockedLocal(undefined)
        router.replace(routePaths.root)
        return
      }

      showLoginFailureAlert(new Error('로그인 실패 😥'))
    },
    [router]
  )

  return (
    <Script
      src='https://accounts.google.com/gsi/client'
      onLoad={() => {
        void autoLogin(afterLogin).catch((error: unknown) => {
          showLoginFailureAlert(error)
        })
      }}
    />
  )
}

function showLoginFailureAlert(error?: unknown) {
  const baseMessage = '로그인에 실패했습니다. 😥 다시 시도해주세요.'
  let detailMessage = ''

  if (
    isAxiosError<
      | {
          error?: string
        }
      | string
    >(error)
  ) {
    const responseData = error.response?.data

    if (typeof responseData === 'string' && responseData) {
      detailMessage = responseData
    } else if (
      typeof responseData === 'object' &&
      responseData !== null &&
      'error' in responseData &&
      typeof responseData.error === 'string' &&
      responseData.error
    ) {
      detailMessage = responseData.error
    } else if (error.message) {
      detailMessage = error.message
    }
  } else if (error instanceof Error && error.message) {
    detailMessage = error.message
  }

  const alertMessage = detailMessage
    ? `${baseMessage}\n${detailMessage}`
    : baseMessage

  alert(alertMessage)
}
