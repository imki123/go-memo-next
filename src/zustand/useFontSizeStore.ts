import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand/react'

import { persistStoreKeys } from './persistStoreKeys'

// 폰트 사이즈 스토어
export type FontSizeStateType = {
  fontSize: number
}

export type FontSizeActionType = {
  setFontSize: (fontSize: number) => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
}

export type FontSizeStoreType = FontSizeStateType & FontSizeActionType

export const useFontSizeStore = create<FontSizeStoreType>()(
  persist(
    (set, get) => ({
      fontSize: 14,

      setFontSize: (fontSize: number) => {
        set({ fontSize })
      },

      increaseFontSize: () => {
        const { fontSize } = get()
        const newSize = fontSize < 42 ? fontSize + 4 : 42
        set({ fontSize: newSize })
      },

      decreaseFontSize: () => {
        const { fontSize } = get()
        const newSize = fontSize > 10 ? fontSize - 4 : 10
        set({ fontSize: newSize })
      },
    }),
    {
      name: persistStoreKeys.fontSize,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
