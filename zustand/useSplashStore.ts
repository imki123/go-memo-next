import { create } from 'zustand/react'

// 초기 스플래시 스토어
export type SplashStateType = {
  visible?: boolean
}

export type SplashActionType = {
  setVisible: (visible?: boolean) => void
}

export type SplashStoreType = SplashStateType & SplashActionType
export const useSplashStore = create<SplashStoreType>()((set) => ({
  visible: undefined,
  setVisible: (visible?: boolean) => set({ visible }),
}))
