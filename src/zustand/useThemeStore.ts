import { create } from 'zustand/react'

import { localStorageKeys } from '@/utils/localStorageKeys'

export type ThemeType = 'dark' | undefined
// 테마 스토어
export type ThemeStateType = {
  theme: ThemeType
}

export type ThemeActionType = {
  setTheme: (theme: ThemeType) => void
}

export type ThemeStoreType = ThemeStateType & ThemeActionType
export const useThemeStore = create<ThemeStoreType>()((set) => ({
  theme: undefined,
  setTheme: (theme: ThemeType) => {
    set({ theme })

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem(localStorageKeys.memoTheme, 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.removeItem(localStorageKeys.memoTheme)
    }

    const color = theme === 'dark' ? '#111827' : 'white'
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.querySelector('meta[name=theme-color]')?.remove()
    document.head?.appendChild(meta)
  },
}))
