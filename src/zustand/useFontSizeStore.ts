import { create } from 'zustand/react'

import { localStorageKeys } from '@/utils/localStorageKeys'

// 폰트 사이즈 스토어
export type FontSizeStateType = {
  fontSize: number
}

export type FontSizeActionType = {
  setFontSize: (fontSize: number) => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
  loadFontSizeFromStorage: () => void
}

export type FontSizeStoreType = FontSizeStateType & FontSizeActionType

export const useFontSizeStore = create<FontSizeStoreType>()((set, get) => ({
  fontSize: 14,

  setFontSize: (fontSize: number) => {
    set({ fontSize })
    localStorage.setItem(localStorageKeys.memoFontSize, String(fontSize))
  },

  increaseFontSize: () => {
    const { fontSize } = get()
    const newSize = fontSize < 42 ? fontSize + 4 : 42
    set({ fontSize: newSize })
    localStorage.setItem(localStorageKeys.memoFontSize, String(newSize))
  },

  decreaseFontSize: () => {
    const { fontSize } = get()
    const newSize = fontSize > 10 ? fontSize - 4 : 10
    set({ fontSize: newSize })
    localStorage.setItem(localStorageKeys.memoFontSize, String(newSize))
  },

  loadFontSizeFromStorage: () => {
    const size = Number(
      localStorage.getItem(localStorageKeys.memoFontSize) || 14
    )
    set({ fontSize: size })
  },
}))
