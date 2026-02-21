import { lockEntity } from './entity'

/**
 * 잠금 서비스
 * 1. 잠금스크린을 보여줘야하는지 여부
 * 2. remote lock 상태 제어
 * 3. local lock 상태 제어
 * 4. 유즈케이스: 잠금 상태 확인 및 잠금 화면 보여주기
 * 5. API 호출 가능 여부 (로그인·잠금 해제 상태)
 */

export type LoginDataForApiCheck = { locked?: boolean } | null | undefined

export type LockService = {
  shouldShowLockScreen: () => Promise<boolean>

  getIsLockedRemote: () => Promise<boolean>
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
    loginData?: LoginDataForApiCheck
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
  remoteLockRepository: RemoteLockRepository
  localLockRepository: LocalLockRepository
}): LockService {
  return {
    shouldShowLockScreen: async () =>
      lockEntity.shouldShowLockScreen({
        isLockedRemote: await remoteLockRepository.getIsLockedRemote(),
        isLockedLocal: localLockRepository.getIsLockedLocal(),
      }),

    // remote lock 상태
    getIsLockedRemote: remoteLockRepository.getIsLockedRemote,
    enableRemote: remoteLockRepository.enableRemote,
    disableRemote: remoteLockRepository.disableRemote,
    unlockRemote: remoteLockRepository.unlockRemote,

    // local lock 상태
    getIsLockedLocal: () => localLockRepository.getIsLockedLocal(),
    setIsLockedLocal: (isLockedLocal: boolean) =>
      localLockRepository.setIsLockedLocal(isLockedLocal),
    getCurrentLockScreenType: () =>
      localLockRepository.getCurrentLockScreenType(),
    getIsLockScreenOpened: () => localLockRepository.getIsLockScreenOpened(),
    showLockScreen: (screenType: LockScreenType) =>
      localLockRepository.showLockScreen(screenType),
    hideLockScreen: () => {
      localLockRepository.hideLockScreen()
    },

    isApiCallAllowed: ({ loginData, isLockedLocal }) => {
      if (!loginData) return false
      if (isLockedLocal) return false
      if (loginData.locked && isLockedLocal !== false) return false
      return true
    },

    useCases: {
      checkLockStatusAndShowUnlockScreen: async () => {
        const shouldShowLockScreen = await lockEntity.shouldShowLockScreen({
          isLockedRemote: await remoteLockRepository.getIsLockedRemote(),
          isLockedLocal: localLockRepository.getIsLockedLocal(),
        })

        if (shouldShowLockScreen) {
          localLockRepository.showLockScreen('unlock')
        }
      },
    },
  }
}

// Interface
export type RemoteLockRepository = {
  getIsLockedRemote: () => Promise<boolean>
  enableRemote: (password: string) => Promise<void>
  disableRemote: () => Promise<void>
  unlockRemote: (password: string) => Promise<void>
}

export type LockScreenType = 'enable' | 'disable' | 'unlock'

export type LocalLockRepository = {
  getIsLockedLocal(): boolean
  setIsLockedLocal(isLockedLocal: boolean): void
  getCurrentLockScreenType(): LockScreenType
  getIsLockScreenOpened(): boolean
  showLockScreen(screenType: LockScreenType): void
  hideLockScreen(): void
}
