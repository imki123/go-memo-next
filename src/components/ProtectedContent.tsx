import { JSX, ReactNode, useEffect } from 'react'

import { userApi } from '@/apis/userApi'
import { useApiQuery } from '@/lib/queryUtils'
import { usePasswordScreenStore } from '@/zustand/usePasswordScreenStore'

/**
 * 앱이 잠겨있는 상태라면 화면을 가리고 데이터를 요청하지 않도록 막아주는 컴포넌트
 */
export function ProtectedContent({
  children,
  fallbackComponent,
}: {
  children: ReactNode
  fallbackComponent?: JSX.Element
}): JSX.Element {
  const { isLocked, openPasswordScreen, setIsLocked, closePasswordScreen } =
    usePasswordScreenStore()

  const { data: loginData, isLoading } = useApiQuery({
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

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-[200px] text-lg'>
        <div>로딩 중...</div>
        <div>서버 재시작 중에는 1분 정도 소요될 수 있습니다.</div>
      </div>
    )
  }

  if (loginData?.locked && isLocked) {
    return (
      fallbackComponent || (
        <div className='flex flex-col items-center justify-center h-[200px] text-lg'>
          <div>메모가 잠겨있습니다.</div>
          <div>비밀번호를 입력하여 잠금을 해제해주세요.</div>
        </div>
      )
    )
  }

  return <>{children}</>
}
