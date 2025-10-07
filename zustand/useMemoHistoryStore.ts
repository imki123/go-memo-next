import { create } from 'zustand/react'

// 메모 히스토리 스토어
export type MemoHistoryStateType = {
  memoHistories: string[]
  currentIndex: number // 현재 히스토리 위치 (0부터 시작)
}

export type MemoHistoryActionType = {
  pushHistory: (newHistory: string) => void
  backHistory: () => void
  nextHistory: () => void
  resetHistory: () => void
}

export type MemoHistoryType = MemoHistoryStateType & MemoHistoryActionType
export const useMemoHistoryStore = create<MemoHistoryType>()((set) => ({
  memoHistories: [],
  currentIndex: -1, // -1은 히스토리가 비어있음을 의미

  pushHistory: (newHistory: string) => {
    set((state: MemoHistoryType) => {
      const updatedHistory = [...state.memoHistories, newHistory]
      return {
        memoHistories: updatedHistory,
        currentIndex: updatedHistory.length - 1, // 마지막 요소의 인덱스
      }
    })
  },

  backHistory: () => {
    set((state: MemoHistoryType) => {
      if (state.currentIndex > 0) {
        return {
          currentIndex: state.currentIndex - 1,
        }
      }
      return state // 변경사항 없음
    })
  },

  nextHistory: () => {
    set((state: MemoHistoryType) => {
      if (state.currentIndex < state.memoHistories.length - 1) {
        return {
          currentIndex: state.currentIndex + 1,
        }
      }
      return state // 변경사항 없음
    })
  },

  resetHistory: () => {
    set({
      memoHistories: [],
      currentIndex: -1,
    })
  },
}))
