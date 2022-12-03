import { MemoModel } from './component/molecule/Memo'
import create from 'zustand'
import { dummyMemos } from './api/dummyMemos'

export interface MemoStoreModel {
  memos?: MemoModel[]
  setMemos: (memos?: MemoModel[]) => void
}

// zustand 글로벌 스토어 hook
export const useMemoStore = create<MemoStoreModel>((set) => ({
  memos: dummyMemos,
  setMemos: (memos) => set({ memos }),
}))

export interface StoreModel {
  memos?: MemoModel[]
  setMemos: (memos?: MemoModel[]) => void
}

export interface MemoHistoryModel {
  memoHistory: string[]
  index: number
  pushHistory: (newHistory: string) => void
  backHistory: () => void
  nextHistory: () => void
  resetHistory: () => void
}

// 메모 기록 스토어
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
