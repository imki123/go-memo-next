import { create } from 'zustand/react'

// 테마 스토어
export type ThemeStateType = {
  theme: 'dark' | undefined
}

export type ThemeActionType = {
  setState: (theme: 'dark' | undefined) => void
}

export type ThemeStoreType = ThemeStateType & ThemeActionType
export const useThemeStore = create<ThemeStoreType>()((set) => ({
  theme: undefined,
  setState: (theme: 'dark' | undefined) => set({ theme }),
}))
