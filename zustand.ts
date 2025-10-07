import { create } from 'zustand/react'

import { dummyMemos } from './apis/dummyMemos'
import { MemoType } from './components/molecules/Memo'

export type MemoStateType = {
  memos?: MemoType[]
}

export type MemoActionType = {
  setMemos: (memos?: MemoType[]) => void
}

export type MemoStoreType = MemoStateType & MemoActionType

// zustand 글로벌 스토어 hook

// 메모스토어
export type StoreStateType = {
  memos?: MemoType[]
}

export type StoreActionType = {
  setMemos: (memos?: MemoType[]) => void
}

export type StoreType = StoreStateType & StoreActionType
export const useMemoStore = create<MemoStoreType>()((set) => ({
  memos: dummyMemos,
  setMemos: (memos?: MemoType[]) => set({ memos }),
}))

// 메모 히스토리 스토어
export type MemoHistoryStateType = {
  memoHistory: string[]
  index: number
}

export type MemoHistoryActionType = {
  pushHistory: (newHistory: string) => void
  backHistory: () => void
  nextHistory: () => void
  resetHistory: () => void
}

export type MemoHistoryType = MemoHistoryStateType & MemoHistoryActionType
export const useMemoHistoryStore = create<MemoHistoryType>()((set) => ({
  memoHistory: [],
  index: -1,
  pushHistory: (newHistory: string) => {
    set((state: MemoHistoryType) => ({
      memoHistory: state.memoHistory
        .slice(0, state.index + 1)
        .concat(newHistory),
      index: state.index + 1,
    }))
  },
  backHistory: () => {
    set((state: MemoHistoryType) => {
      if (state.memoHistory[state.index - 1]) {
        return {
          index: state.index - 1,
        }
      } else {
        return {}
      }
    })
  },
  nextHistory: () => {
    set((state: MemoHistoryType) => {
      if (state.memoHistory[state.index + 1]) {
        return {
          index: state.index + 1,
        }
      } else {
        return {}
      }
    })
  },
  resetHistory: () => {
    set({
      memoHistory: [],
      index: -1,
    })
  },
}))

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
