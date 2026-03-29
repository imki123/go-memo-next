import { create } from 'zustand'

import { IsLockedLocalStatus } from '@/domain/lock/entity'
import type { LockScreenType } from '@/domain/lock/entity'

export interface ILockStore {
  isLockedLocal: IsLockedLocalStatus
  setIsLockedLocal: (isLockedLocal: IsLockedLocalStatus) => void
  isLockScreenOpened: boolean
  setIsLockScreenOpened: (isLockScreenOpened: boolean) => void
  lockScreenType: LockScreenType
  setLockScreenType: (lockScreenType: LockScreenType) => void
}

export const useLockStore = create<ILockStore>()((set) => ({
  isLockedLocal: undefined,
  setIsLockedLocal: (isLockedLocal) => set({ isLockedLocal }),
  isLockScreenOpened: false,
  setIsLockScreenOpened: (isLockScreenOpened) => set({ isLockScreenOpened }),
  lockScreenType: 'unlock',
  setLockScreenType: (lockScreenType) => set({ lockScreenType }),
}))
