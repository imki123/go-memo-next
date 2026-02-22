import { useLockStore } from './store'

import type { LockLocalRepository } from '@/domains/lock/service'


type LockStore = ReturnType<typeof useLockStore.getState>

export function createZustandLockLocalRepository(
  getStore: () => LockStore
): LockLocalRepository {
  return {
    getIsLockedLocal: () => getStore().isLockedLocal ?? false,
    setIsLockedLocal: (isLockedLocal) =>
      getStore().setIsLockedLocal(isLockedLocal),
    getCurrentLockScreenType: () => getStore().lockScreenType,
    getIsLockScreenOpened: () => getStore().lockScreenOpened,
    showLockScreen: (screenType) => getStore().openLockScreen(screenType),
    hideLockScreen: () => getStore().closeLockScreen(),
  }
}

export function getLocalLockRepository(): LockLocalRepository {
  return createZustandLockLocalRepository(useLockStore.getState)
}
