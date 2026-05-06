import { produce } from 'immer'
import { create } from 'zustand/react'

import { dummyMemos } from '@/apis/dummyMemos'
import type { MemoEntity } from '@/domain/memo/entity'

// 메모스토어
export type AllMemoStateType = {
  allMemos: MemoEntity[]
}

export type AllMemoActionType = {
  setMemo: (memo: MemoEntity) => void
  setAllMemos: (memos?: MemoEntity[]) => void
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
    setAllMemos: (memos?: MemoEntity[]) => set({ allMemos: memos }),
    deleteMemo: (memoId: number) =>
      set({
        allMemos: get().allMemos.filter(
          (memo) => memo.memoId !== Number(memoId)
        ),
      }),
  })
)
