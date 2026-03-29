import { useEffect } from 'react'

import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'
import { LockScreen } from '@/shared/components/LockScreen'

export function LockScreenController() {
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

    const isLoggedIn = Boolean(checkLoginQueryResult.data?.token)

    // NOTE: 로그인 상태가 아닌 경우 잠금 화면을 표시하지 않음
    if (!isLoggedIn) {
      if (lockScreenType === 'unlock') {
        hideLockScreen()
      }
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
