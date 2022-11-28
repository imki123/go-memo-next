import { MemoModel } from '../component/Memo'
import create from 'zustand'
import { dummyMemos } from '../dummy/dummyMemos'

export interface StoreModel {
  memos?: MemoModel[]
  setMemos: (memos?: MemoModel[]) => void
}

// zustand 글로벌 스토어 hook
export const useStore = create<StoreModel>((set) => ({
  memos: dummyMemos,
  setMemos: (memos) => set({ memos }),
}))
