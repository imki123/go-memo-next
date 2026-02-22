import { create } from 'zustand'

import { IsLockedLocalStatus } from '@/domain/lock/entity'
import { LockStore } from '@/domain/lock/facade'
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

export const lockStore: LockStore = {
  useIsLockedLocal: () => useLockStore((s) => s.isLockedLocal),
  useIsLockScreenOpened: () => useLockStore((s) => s.isLockScreenOpened),
  useLockScreenType: () => useLockStore((s) => s.lockScreenType),
  setIsLockedLocal: (isLockedLocal: IsLockedLocalStatus) =>
    useLockStore.getState().setIsLockedLocal(isLockedLocal),
  showLockScreen: (screenType: LockScreenType) =>
    useLockStore.getState().openLockScreen(screenType),
  hideLockScreen: () => useLockStore.getState().closeLockScreen(),
}
