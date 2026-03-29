import type { IsLockedLocalStatus, LockScreenType } from './entity'

export interface LockRemoteRepositoryPort {
  getLockedStatus(): Promise<boolean>
  enableRemote(password: string): Promise<void>
  disableRemote(password: string): Promise<void>
  unlockRemote(password: string): Promise<void>
}

export interface LockLocalRepositoryPort {
  getIsLockedLocal(): IsLockedLocalStatus
  setIsLockedLocal(isLockedLocal: IsLockedLocalStatus): void
  getCurrentLockScreenType(): LockScreenType
  getIsLockScreenOpened(): boolean
  showLockScreen(screenType: LockScreenType): void
  hideLockScreen(): void
}
