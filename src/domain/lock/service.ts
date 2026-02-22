import { IsLockedLocalStatus, lockEntity } from './entity'

export type LockService = {
  shouldShowLockScreen: () => Promise<boolean>
  getLockedStatus: () => Promise<boolean>
  enableRemote: (password: string) => Promise<void>
  disableRemote: () => Promise<void>
  unlockRemote: (password: string) => Promise<void>
  getIsLockedLocal: () => IsLockedLocalStatus
  setIsLockedLocal: (isLockedLocal: IsLockedLocalStatus) => void
  getCurrentLockScreenType: () => LockScreenType
  getIsLockScreenOpened: () => boolean
  showLockScreen: (screenType: LockScreenType) => void
  hideLockScreen: () => void
  isApiCallAllowed: (options: {
    isLockedRemote?: boolean
    isLockedLocal?: IsLockedLocalStatus
  }) => boolean
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
    setIsLockedLocal: (isLockedLocal) =>
      localLockRepository.setIsLockedLocal(isLockedLocal),
    getCurrentLockScreenType: () =>
      localLockRepository.getCurrentLockScreenType(),
    getIsLockScreenOpened: () => localLockRepository.getIsLockScreenOpened(),
    showLockScreen: (screenType) =>
      localLockRepository.showLockScreen(screenType),
    hideLockScreen: () => localLockRepository.hideLockScreen(),

    isApiCallAllowed: (options) => isApiCallAllowed(options),
  }
}

export function isApiCallAllowed(options: {
  isLockedRemote?: boolean
  isLockedLocal?: IsLockedLocalStatus
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
  getIsLockedLocal(): IsLockedLocalStatus
  setIsLockedLocal(isLockedLocal: IsLockedLocalStatus): void
  getCurrentLockScreenType(): LockScreenType
  getIsLockScreenOpened(): boolean
  showLockScreen(screenType: LockScreenType): void
  hideLockScreen(): void
}
