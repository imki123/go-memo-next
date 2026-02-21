import { create } from 'zustand'

import { LockScreenType } from '@/domains/lock/service'

type LockScreenStateType = {
  isLockedLocal: boolean | undefined
  lockScreenOpened: boolean
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

export const useLockServiceStore = create<LockScreenStoreType>()((set) => ({
  isLockedLocal: undefined,
  lockScreenOpened: false,
  lockScreenType: 'unlock',

  openLockScreen: (lockScreenType) =>
    set({ lockScreenOpened: true, lockScreenType }),

  closeLockScreen: () =>
    set({ lockScreenOpened: false, lockScreenType: 'unlock' }),
  setIsLockedLocal: (isLockedLocal) => set({ isLockedLocal }),
}))
