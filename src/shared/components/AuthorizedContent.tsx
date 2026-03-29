import { JSX, ReactNode } from 'react'

import { useAuthService } from '@/domain/auth/useAuthService'
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
  const {
    state: { isAuthenticated },
  } = useAuthService()

  const { isLockedLocal, checkLoginQueryResult } = useLockService({
    enabled: isAuthenticated,
  })

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
