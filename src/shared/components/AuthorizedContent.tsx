import { JSX, ReactNode, useEffect, useState } from 'react'

import { useAuthService } from '@/domain/auth/hook'
import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'

export function AuthorizedContent({
  children,
  unauthorizedComponent,
  loadingComponent,
}: {
  children: ReactNode
  unauthorizedComponent?: ReactNode
  loadingComponent?: ReactNode
}): JSX.Element {
  const [isMounted, setIsMounted] = useState(false)

  const {
    state: { isAuthenticated },
  } = useAuthService()

  const { isLockedLocal, checkLoginQueryResult } = useLockService({
    enabled: isAuthenticated,
  })

  useEffect(() => {
    // NOTE: SSR/CSR 간 UI 불일치로 인한 hydration 에러를 방지
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{loadingComponent ?? null}</>
  }

  if (!isAuthenticated) {
    return <>{unauthorizedComponent ?? null}</>
  }

  // NOTE: 최초 로딩 중 (서버 sleep 후 첫 요청 등) - 잠금 상태를 알 수 없음
  if (checkLoginQueryResult.isPending) {
    return <>{loadingComponent ?? null}</>
  }

  const isLockedRemote = checkLoginQueryResult.data?.locked ?? false
  const shouldHideContent = lockEntity.shouldShowLockScreen({
    isLockedRemote,
    isLockedLocal,
  })

  if (shouldHideContent) {
    return <></>
  }

  return <>{children}</>
}
