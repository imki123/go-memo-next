import { IsLockedLocalStatus, lockEntity } from './entity'
import { LockLocalRepositoryPort, LockRemoteRepositoryPort } from './ports'
import { lockLocalRepository } from './repositories/localRepository'
import { lockRemoteRepository } from './repositories/remoteRepository'

export type LockScreenType = 'enable' | 'disable' | 'unlock'

export class LockService {
  constructor(
    private readonly remoteLockRepository: LockRemoteRepositoryPort,
    private readonly localLockRepository: LockLocalRepositoryPort
  ) {}

  async shouldShowLockScreen(): Promise<boolean> {
    return lockEntity.shouldShowLockScreen({
      isLockedRemote: await this.remoteLockRepository.getLockedStatus(),
      isLockedLocal: this.localLockRepository.getIsLockedLocal(),
    })
  }

  async getLockedStatus(): Promise<boolean> {
    return this.remoteLockRepository.getLockedStatus()
  }

  async enableRemote(password: string): Promise<void> {
    await this.remoteLockRepository.enableRemote(password)
  }

  async disableRemote(): Promise<void> {
    await this.remoteLockRepository.disableRemote()
  }

  async unlockRemote(password: string): Promise<void> {
    await this.remoteLockRepository.unlockRemote(password)
  }

  getIsLockedLocal(): IsLockedLocalStatus {
    return this.localLockRepository.getIsLockedLocal()
  }

  setIsLockedLocal(isLockedLocal: IsLockedLocalStatus): void {
    this.localLockRepository.setIsLockedLocal(isLockedLocal)
  }

  getCurrentLockScreenType(): LockScreenType {
    return this.localLockRepository.getCurrentLockScreenType()
  }

  getIsLockScreenOpened(): boolean {
    return this.localLockRepository.getIsLockScreenOpened()
  }

  showLockScreen(screenType: LockScreenType): void {
    this.localLockRepository.showLockScreen(screenType)
  }

  hideLockScreen(): void {
    this.localLockRepository.hideLockScreen()
  }

  isApiCallAllowed(options: {
    isLockedRemote?: boolean
    isLockedLocal?: IsLockedLocalStatus
  }): boolean {
    return lockEntity.isApiCallAllowed(options)
  }
}

export const lockService = new LockService(
  lockRemoteRepository,
  lockLocalRepository
)
