import { produce } from 'immer'
import { create } from 'zustand/react'

import { dummyMemos } from '../apis/dummyMemos'
import { MemoType } from '../components/Memo'

// 메모스토어
export type AllMemoStateType = {
  allMemos?: MemoType[]
}

export type AllMemoActionType = {
  setMemo: (memo: MemoType) => void
  setAllMemos: (memos?: MemoType[]) => void
  deleteMemo: (memoId: number) => void
}

export const useAllMemosStore = create<AllMemoStateType & AllMemoActionType>()(
  (set, get) => ({
    allMemos: dummyMemos,

    setMemo: ({ memoId, text, createdAt, editedAt }) =>
      set({
        allMemos: produce(get().allMemos, (draft) => {
          const previousMemo = draft?.find((memo) => memo.memoId === memoId)
          if (previousMemo) {
            previousMemo.text = text
            previousMemo.createdAt = createdAt
            previousMemo.editedAt = editedAt
          } else {
            draft?.push({
              memoId,
              text,
              createdAt,
              editedAt,
            })
          }
          return draft
        }),
      }),
    setAllMemos: (memos?: MemoType[]) => set({ allMemos: memos }),
    deleteMemo: (memoId: number) =>
      set({
        allMemos: produce(get().allMemos, (draft) =>
          draft?.filter((memo) => memo.memoId !== memoId)
        ),
      }),
  })
)
