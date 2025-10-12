import { create } from 'zustand'

type PasswordStateType = {
  passwordScreenOpened: boolean
  passwordScreenType: 'setup' | 'unlock' | 'remove'
  isLocked: boolean | undefined
}

type PasswordActionType = {
  openPasswordScreen: (
    passwordScreenType: PasswordStateType['passwordScreenType']
  ) => void
  closePasswordScreen: () => void
  setIsLocked: (isLocked: PasswordStateType['isLocked']) => void
}

type PasswordStoreType = PasswordStateType & PasswordActionType

export const usePasswordScreenStore = create<PasswordStoreType>()((set) => ({
  passwordScreenOpened: false,
  passwordScreenType: 'unlock',
  isLocked: undefined,

  openPasswordScreen: (passwordScreenType) =>
    set({ passwordScreenOpened: true, passwordScreenType }),

  closePasswordScreen: () =>
    set({ passwordScreenOpened: false, passwordScreenType: 'unlock' }),
  setIsLocked: (isLocked) => set({ isLocked }),
}))
