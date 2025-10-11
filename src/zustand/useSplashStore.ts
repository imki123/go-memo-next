import { create } from 'zustand/react'

// 초기 스플래시 스토어
export type SplashStateType = {
  splashVisible?: boolean
}

export type SplashActionType = {
  setSplashVisible: (visible?: boolean) => void
}

export type SplashStoreType = SplashStateType & SplashActionType
export const useSplashStore = create<SplashStoreType>()((set) => ({
  splashVisible: undefined,
  setSplashVisible: (visible?: boolean) => set({ splashVisible: visible }),
}))
