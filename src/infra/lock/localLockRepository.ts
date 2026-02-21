import { LocalLockRepository, LockScreenType } from '@/domains/lock/service'

import { useLockServiceStore } from './useLockServiceStore'

export const localLockRepository: LocalLockRepository = {
  getIsLockedLocal: () => useLockServiceStore.getState().isLockedLocal || false,
  setIsLockedLocal: (isLocked: boolean) =>
    useLockServiceStore.setState({ isLockedLocal: isLocked }),
  getCurrentLockScreenType: () => useLockServiceStore.getState().lockScreenType,
  getIsLockScreenOpened: () => useLockServiceStore.getState().lockScreenOpened,
  showLockScreen: (screenType: LockScreenType) =>
    useLockServiceStore.getState().openLockScreen(screenType),
  hideLockScreen: () => useLockServiceStore.getState().closeLockScreen(),
}
