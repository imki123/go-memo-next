import { useEffect } from 'react'

import { LockScreen } from '@/components/LockScreen'
import { lockEntity } from '@/domain/lock/entity'
import {
  useLockActions,
  useLockQueries,
  useLockScreenState,
} from '@/domain/lock/hook'

export function LockInitializer() {
  const { isLockedLocal } = useLockScreenState()
  const { lockedStatus } = useLockQueries()
  const { showLockScreen, hideLockScreen } = useLockActions()

  useEffect(() => {
    if (lockedStatus.isFetching) {
      return
    }

    const shouldShowLockScreen = lockEntity.shouldShowLockScreen({
      isLockedRemote: lockedStatus.data,
      isLockedLocal,
    })

    if (shouldShowLockScreen) {
      showLockScreen('unlock')
    } else {
      hideLockScreen()
    }
  }, [
    isLockedLocal,
    lockedStatus.data,
    lockedStatus.isFetching,
    showLockScreen,
    hideLockScreen,
  ])

  return <LockScreen />
}
