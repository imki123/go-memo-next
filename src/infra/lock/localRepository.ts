import type { LockLocalRepository } from '@/domains/lock/service'

import { useLockStore } from './store'

export const localLockRepository: LockLocalRepository = {
  getIsLockedLocal: () => useLockStore.getState().isLockedLocal ?? false,
  setIsLockedLocal: (isLockedLocal) =>
    useLockStore.getState().setIsLockedLocal(isLockedLocal),
  getCurrentLockScreenType: () => useLockStore.getState().lockScreenType,
  getIsLockScreenOpened: () => useLockStore.getState().lockScreenOpened,
  showLockScreen: (screenType) =>
    useLockStore.getState().openLockScreen(screenType),
  hideLockScreen: () => useLockStore.getState().closeLockScreen(),
}
