import { create } from 'zustand/react'

// 초기 스플래시 스토어
export type SplashStateType = {
  initial?: boolean
}

export type SplashActionType = {
  setState: (initial?: boolean) => void
}

export type SplashStoreType = SplashStateType & SplashActionType
export const useSplashStore = create<SplashStoreType>()((set) => ({
  initial: undefined,
  setState: (initial: boolean | undefined) => set({ initial }),
}))
