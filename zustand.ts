import { create } from 'zustand'

import { dummyMemos } from './api/dummyMemos'
import { MemoModel } from './component/molecule/Memo'

export interface MemoStoreModel {
  memos?: MemoModel[]
  setMemos: (memos?: MemoModel[]) => void
}

// zustand 글로벌 스토어 hook

// 메모스토어
export interface StoreModel {
  memos?: MemoModel[]
  setMemos: (memos?: MemoModel[]) => void
}
export const useMemoStore = create<MemoStoreModel>((set) => ({
  memos: dummyMemos,
  setMemos: (memos) => set({ memos }),
}))

// 메모 히스토리 스토어
export interface MemoHistoryModel {
  memoHistory: string[]
  index: number
  pushHistory: (newHistory: string) => void
  backHistory: () => void
  nextHistory: () => void
  resetHistory: () => void
}
export const useMemoHistoryStore = create<MemoHistoryModel>((set) => ({
  memoHistory: [],
  index: -1,
  pushHistory: (newHistory) => {
    set(({ memoHistory, index }) => ({
      memoHistory: memoHistory.slice(0, index + 1).concat(newHistory),
      index: index + 1,
    }))
  },
  backHistory: () => {
    set(({ index, memoHistory }) => {
      if (memoHistory[index - 1]) {
        return {
          index: index - 1,
        }
      } else {
        return {}
      }
    })
  },
  nextHistory: () => {
    set(({ index, memoHistory }) => {
      if (memoHistory[index + 1]) {
        return {
          index: index + 1,
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
export interface ThemeStoreModel {
  theme?: 'dark'
  set: (theme?: 'dark') => void
}
export const useThemeStore = create<ThemeStoreModel>((set) => ({
  theme: undefined,
  set: (theme) => set({ theme }),
}))

// 초기 스플래시 스토어
export type SplashStoreType = {
  initial?: boolean
  set: (initial?: boolean) => void
}
export const useSplashStore = create<SplashStoreType>((set) => ({
  initial: undefined,
  set: (initial) => set({ initial }),
}))
