import { lockEntity } from './entity'

export type LockService = {
  shouldShowLockScreen: () => Promise<boolean>
  getLockedStatus: () => Promise<boolean>
  enableRemote: (password: string) => Promise<void>
  disableRemote: () => Promise<void>
  unlockRemote: (password: string) => Promise<void>
  getIsLockedLocal: () => boolean
  setIsLockedLocal: (isLockedLocal: boolean) => void
  getCurrentLockScreenType: () => LockScreenType
  getIsLockScreenOpened: () => boolean
  showLockScreen: (screenType: LockScreenType) => void
  hideLockScreen: () => void
  isApiCallAllowed: (options: {
    isLockedRemote?: boolean
    isLockedLocal?: boolean
  }) => boolean
  useCases: {
    checkLockStatusAndShowUnlockScreen: () => Promise<void>
  }
}

export function createLockService({
  remoteLockRepository,
  localLockRepository,
}: {
  remoteLockRepository: LockRemoteRepository
  localLockRepository: LockLocalRepository
}): LockService {
  return {
    shouldShowLockScreen: async () =>
      lockEntity.shouldShowLockScreen({
        isLockedRemote: await remoteLockRepository.getLockedStatus(),
        isLockedLocal: localLockRepository.getIsLockedLocal(),
      }),

    getLockedStatus: remoteLockRepository.getLockedStatus,
    enableRemote: remoteLockRepository.enableRemote,
    disableRemote: remoteLockRepository.disableRemote,
    unlockRemote: remoteLockRepository.unlockRemote,

    getIsLockedLocal: () => localLockRepository.getIsLockedLocal(),
    setIsLockedLocal: (v) => localLockRepository.setIsLockedLocal(v),
    getCurrentLockScreenType: () =>
      localLockRepository.getCurrentLockScreenType(),
    getIsLockScreenOpened: () => localLockRepository.getIsLockScreenOpened(),
    showLockScreen: (t) => localLockRepository.showLockScreen(t),
    hideLockScreen: () => localLockRepository.hideLockScreen(),

    isApiCallAllowed: (options) => isApiCallAllowed(options),

    useCases: {
      checkLockStatusAndShowUnlockScreen: async () => {
        const should = await lockEntity.shouldShowLockScreen({
          isLockedRemote: await remoteLockRepository.getLockedStatus(),
          isLockedLocal: localLockRepository.getIsLockedLocal(),
        })
        if (should) localLockRepository.showLockScreen('unlock')
      },
    },
  }
}

export function isApiCallAllowed(options: {
  isLockedRemote?: boolean
  isLockedLocal?: boolean
}): boolean {
  const { isLockedRemote, isLockedLocal } = options
  if (isLockedRemote === undefined) return false
  if (isLockedLocal) return false
  if (isLockedRemote && isLockedLocal !== false) return false
  return true
}

export type LockScreenType = 'enable' | 'disable' | 'unlock'

export type LockRemoteRepository = {
  getLockedStatus: () => Promise<boolean>
  enableRemote: (password: string) => Promise<void>
  disableRemote: () => Promise<void>
  unlockRemote: (password: string) => Promise<void>
}

export type LockLocalRepository = {
  getIsLockedLocal(): boolean
  setIsLockedLocal(isLockedLocal: boolean): void
  getCurrentLockScreenType(): LockScreenType
  getIsLockScreenOpened(): boolean
  showLockScreen(screenType: LockScreenType): void
  hideLockScreen(): void
}
