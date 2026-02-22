import { create } from 'zustand'

import { LockStore } from '@/domain/lock/facade'
import type { LockScreenType } from '@/domain/lock/service'

type LockScreenStateType = {
  isLockedLocal: boolean
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

export const useLockStore = create<LockScreenStoreType>()((set) => ({
  isLockedLocal: true,
  lockScreenOpened: false,
  lockScreenType: 'unlock',

  openLockScreen: (lockScreenType) =>
    set({ lockScreenOpened: true, lockScreenType }),

  closeLockScreen: () =>
    set({ lockScreenOpened: false, lockScreenType: 'unlock' }),

  setIsLockedLocal: (isLockedLocal) => set({ isLockedLocal }),
}))

export const lockStore: LockStore = {
  watchIsLockedLocal: (): boolean =>
    useLockStore((s) => s.isLockedLocal) as boolean,
  watchLockScreenOpened: (): boolean =>
    useLockStore((s) => s.lockScreenOpened) as boolean,
  watchLockScreenType: (): LockScreenType =>
    useLockStore((s) => s.lockScreenType) as LockScreenType,
  setIsLockedLocal: (v: boolean) => useLockStore.getState().setIsLockedLocal(v),
  showLockScreen: (screenType: LockScreenType) =>
    useLockStore.getState().openLockScreen(screenType),
  hideLockScreen: () => useLockStore.getState().closeLockScreen(),
}
