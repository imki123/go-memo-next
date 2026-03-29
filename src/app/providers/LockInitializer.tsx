import { useEffect } from 'react'

import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'
import { LockScreen } from '@/shared/components/LockScreen'

export function LockInitializer() {
  const { isLockedLocal, lockedStatus, lockScreenType, showLockScreen, hideLockScreen } =
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
    } else if (lockScreenType === 'unlock') {
      // enable/disable는 사용자가 직접 열고 닫으므로 unlock 모드일 때만 자동으로 닫음
      hideLockScreen()
    }
  }, [
    isLockedLocal,
    lockedStatus.data,
    lockedStatus.isFetching,
    lockScreenType,
    showLockScreen,
    hideLockScreen,
  ])

  return <LockScreen />
}
