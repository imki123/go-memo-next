import type { LockLocalRepositoryPort } from '@/domain/lock/port'
import { useLockStore } from '@/infra/store/useLockStore'

export const lockLocalRepository: LockLocalRepositoryPort = {
  getIsLockedLocal: () => useLockStore.getState().isLockedLocal,
  setIsLockedLocal: (isLockedLocal) =>
    useLockStore.getState().setIsLockedLocal(isLockedLocal),
  getCurrentLockScreenType: () => useLockStore.getState().lockScreenType,
  getIsLockScreenOpened: () => useLockStore.getState().isLockScreenOpened,
  showLockScreen: (screenType) => {
    const { setIsLockScreenOpened, setLockScreenType } = useLockStore.getState()

    setLockScreenType(screenType)
    setIsLockScreenOpened(true)
  },
  hideLockScreen: () => {
    const { setIsLockScreenOpened, setLockScreenType } = useLockStore.getState()

    setIsLockScreenOpened(false)
    setLockScreenType('unlock')
  },
}
