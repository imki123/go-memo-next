import { useEffect } from 'react'

import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'
import { LockScreen } from '@/shared/components/LockScreen'

export function LockInitializer() {
  const {
    isLockedLocal,
    checkLoginQueryResult,
    lockScreenType,
    showLockScreen,
    hideLockScreen,
  } = useLockService()

  useEffect(() => {
    if (checkLoginQueryResult.isFetching) {
      return
    }

    const shouldShowLockScreen = lockEntity.shouldShowLockScreen({
      isLockedRemote: checkLoginQueryResult.data?.locked ?? false,
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
    checkLoginQueryResult.data,
    checkLoginQueryResult.isFetching,
    lockScreenType,
    showLockScreen,
    hideLockScreen,
  ])

  return <LockScreen />
}
