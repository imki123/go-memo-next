import { JSX, ReactNode } from 'react'

import { useAuthService } from '@/domain/auth/useAuthService'
import { lockEntity } from '@/domain/lock/entity'
import { useLockQueries, useLockScreenState } from '@/domain/lock/hook'

export function AuthorizedContent({
  children,
  unauthorizedComponent,
}: {
  children: ReactNode
  unauthorizedComponent?: ReactNode
}): JSX.Element {
  const {
    state: { isAuthenticated },
  } = useAuthService()

  const { isLockedLocal } = useLockScreenState()
  const { lockedStatus } = useLockQueries({ enabled: isAuthenticated })

  const shouldHideContent = (() => {
    if (lockedStatus.isFetching) {
      return true
    }

    return lockEntity.shouldShowLockScreen({
      isLockedRemote: lockedStatus.data,
      isLockedLocal,
    })
  })()

  if (!isAuthenticated) {
    return <>{unauthorizedComponent ?? null}</>
  }

  if (shouldHideContent) {
    return <></>
  }

  return <>{children}</>
}

