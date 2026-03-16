import { useEffect } from 'react'

import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'
import { LockScreen } from '@/shared/components/LockScreen'

export function LockInitializer() {
  const { isLockedLocal, lockedStatus, showLockScreen, hideLockScreen } =
    useLockService()

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
