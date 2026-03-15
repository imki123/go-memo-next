import type { LockLocalRepositoryPort } from '@/domain/lock/ports'
import { useLockStore } from '@/infra/store/lockStore'

export const localLockRepository: LockLocalRepositoryPort = {
  getIsLockedLocal: () => useLockStore.getState().isLockedLocal,
  setIsLockedLocal: (isLockedLocal) =>
    useLockStore.getState().setIsLockedLocal(isLockedLocal),
  getCurrentLockScreenType: () => useLockStore.getState().lockScreenType,
  getIsLockScreenOpened: () => useLockStore.getState().isLockScreenOpened,
  showLockScreen: (screenType) =>
    useLockStore.getState().openLockScreen(screenType),
  hideLockScreen: () => useLockStore.getState().closeLockScreen(),
}
