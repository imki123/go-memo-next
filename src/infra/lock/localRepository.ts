import type { LockLocalRepository } from '@/domain/lock/service'

import { useLockStore } from './store'

export const localLockRepository: LockLocalRepository = {
  getIsLockedLocal: () => useLockStore.getState().isLockedLocal,
  setIsLockedLocal: (isLockedLocal) =>
    useLockStore.getState().setIsLockedLocal(isLockedLocal),
  getCurrentLockScreenType: () => useLockStore.getState().lockScreenType,
  getIsLockScreenOpened: () => useLockStore.getState().isLockScreenOpened,
  showLockScreen: (screenType) =>
    useLockStore.getState().openLockScreen(screenType),
  hideLockScreen: () => useLockStore.getState().closeLockScreen(),
}
