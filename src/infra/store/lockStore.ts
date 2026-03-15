import { create } from 'zustand'

import { IsLockedLocalStatus } from '@/domain/lock/entity'
import type { LockScreenType } from '@/domain/lock/service'

type LockScreenStateType = {
  isLockedLocal: IsLockedLocalStatus
  isLockScreenOpened: boolean
  lockScreenType: LockScreenType
}

type LockScreenActionType = {
  openLockScreen: (
    lockScreenType: LockScreenStateType['lockScreenType']
  ) => void
  closeLockScreen: () => void
  setIsLockedLocal: (
    isLockedLocal: LockScreenStateType['isLockedLocal']
  ) => void
}

type LockScreenStoreType = LockScreenStateType & LockScreenActionType

export const useLockStore = create<LockScreenStoreType>()((set) => ({
  isLockedLocal: undefined,
  isLockScreenOpened: false,
  lockScreenType: 'unlock',

  openLockScreen: (lockScreenType) =>
    set({ isLockScreenOpened: true, lockScreenType }),

  closeLockScreen: () =>
    set({ isLockScreenOpened: false, lockScreenType: 'unlock' }),

  setIsLockedLocal: (isLockedLocal) => set({ isLockedLocal }),
}))

