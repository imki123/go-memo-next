import { create } from 'zustand'

type PasswordStateType = {
  passwordScreenOpened: boolean
  passwordScreenType: 'setup' | 'unlock'
}

type PasswordActionType = {
  openPasswordScreen: (passwordScreenType: 'setup' | 'unlock') => void
  closePasswordScreen: () => void
}

type PasswordStoreType = PasswordStateType & PasswordActionType

export const usePasswordScreenStore = create<PasswordStoreType>()((set) => ({
  passwordScreenOpened: false,
  passwordScreenType: 'unlock',

  openPasswordScreen: (passwordScreenType: 'setup' | 'unlock') =>
    set({ passwordScreenOpened: true, passwordScreenType }),
  closePasswordScreen: () =>
    set({ passwordScreenOpened: false, passwordScreenType: 'unlock' }),
}))
