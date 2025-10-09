import { create } from 'zustand/react'

export type LoginStateType = {
  isLoggingIn?: boolean
  secondsToLogin: number
  loginIntervalId?: NodeJS.Timeout
}

export type LoginActionType = {
  setIsLoggingIn: (isLoggingIn?: boolean) => void
  setSecondsToLogin: (secondsToLogin?: number) => void
  setLoginIntervalId: (loginIntervalId?: NodeJS.Timeout) => void
}

export type LoginStoreType = LoginStateType & LoginActionType
export const useLoginStore = create<LoginStoreType>()((set) => ({
  isLoggingIn: undefined,
  secondsToLogin: 0,
  loginIntervalId: undefined,

  setIsLoggingIn: (isLoggingIn?: boolean) => set({ isLoggingIn }),
  setSecondsToLogin: (secondsToLogin?: number) => set({ secondsToLogin }),
  setLoginIntervalId: (loginIntervalId?: NodeJS.Timeout) =>
    set({ loginIntervalId }),
}))
