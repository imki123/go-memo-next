import { JSX, ReactNode, useEffect } from 'react'

import { lockFacade } from '@/domain/lock/di'

/**
 * 인증되어있지 않다면 화면을 가리고 데이터를 요청하지 않도록 막아주는 컴포넌트
 */
export function AuthorizedContent({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const isLockedLocal = lockFacade.store.useIsLockedLocal()
  const {
    data: isLockedRemote,
    isFetching,
    isError,
  } = lockFacade.query.useLockedStatus()

  useEffect(() => {
    if (isLockedRemote) {
      lockFacade.store.setIsLockedLocal(true)
      lockFacade.store.showLockScreen('unlock')
    } else {
      lockFacade.store.setIsLockedLocal(false)
      lockFacade.store.hideLockScreen()
    }
  }, [isLockedRemote])

  if (isFetching) {
    return (
      <div className='flex flex-col items-center justify-center h-[200px] text-lg'>
        <div>로딩 중...</div>
        <div>서버 재시작 중에는 1분 정도 소요될 수 있습니다.</div>
      </div>
    )
  }

  if (isError || isLockedRemote === undefined) {
    return <></>
  }

  if (isLockedLocal) {
    return <></>
  }

  return <>{children}</>
}
