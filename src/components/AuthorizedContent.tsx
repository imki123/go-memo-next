import { JSX, ReactNode, useEffect } from 'react'

import { userApi } from '@/apis/userApi'
import { lockService } from '@/domains/lock/di'
import { useLockServiceStore } from '@/infra/lock/useLockServiceStore'
import { useApiQuery } from '@/lib/queryUtils'

/**
 * 인증되어있지 않다면 화면을 가리고 데이터를 요청하지 않도록 막아주는 컴포넌트
 */
export function AuthorizedContent({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const isLockedLocal = useLockServiceStore((s) => s.isLockedLocal)

  const {
    data: loginData,
    isFetching,
    isError,
  } = useApiQuery({
    queryFn: userApi.checkLogin,
  })

  useEffect(() => {
    // NOTE: 잠김 여부 확인 후 잠김 상태라면 잠금 화면 표시
    if (loginData?.locked) {
      lockService.setIsLockedLocal(true)
      lockService.useCases.checkLockStatusAndShowUnlockScreen()
    } else {
      lockService.setIsLockedLocal(false)
      lockService.hideLockScreen()
    }
  }, [loginData?.locked])

  if (isFetching) {
    return (
      <div className='flex flex-col items-center justify-center h-[200px] text-lg'>
        <div>로딩 중...</div>
        <div>서버 재시작 중에는 1분 정도 소요될 수 있습니다.</div>
      </div>
    )
  }

  if (isError || !loginData) {
    return <></>
  }

  if (isLockedLocal) {
    return <></>
  }

  return <>{children}</>
}
