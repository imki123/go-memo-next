import { JSX, ReactNode, useEffect } from 'react'

import { userApi } from '@/apis/userApi'
import { useApiQuery } from '@/lib/queryUtils'
import { usePasswordScreenStore } from '@/zustand/usePasswordScreenStore'

export function ProtectedContent({
  children,
  fallbackComponent,
}: {
  children: ReactNode
  fallbackComponent?: JSX.Element
}): JSX.Element {
  const { isLocked, openPasswordScreen, setIsLocked, closePasswordScreen } =
    usePasswordScreenStore()
  const { data: loginData } = useApiQuery({
    queryFn: userApi.checkLogin,
  })

  useEffect(() => {
    if (loginData?.locked && (isLocked || isLocked === undefined)) {
      openPasswordScreen('unlock')
      setIsLocked(true)
    } else {
      closePasswordScreen()
    }
  }, [
    loginData?.locked,
    isLocked,
    openPasswordScreen,
    setIsLocked,
    closePasswordScreen,
  ])

  if (loginData?.locked && isLocked) {
    return (
      fallbackComponent || (
        <div className='flex flex-col items-center justify-center h-[200px]'>
          <div>메모가 잠겨있습니다.</div>
          <div>비밀번호를 입력하여 잠금을 해제해주세요.</div>
        </div>
      )
    )
  }

  return <>{children}</>
}
