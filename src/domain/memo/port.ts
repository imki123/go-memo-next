import type { MemoType } from '@/shared/components/home/Memo'

export interface MemoRemoteRepositoryPort {
  getAllMemos(): Promise<MemoType[]>
  getMemo(memoId: number): Promise<MemoType | undefined>
  createMemo(): Promise<MemoType>
  updateMemo(memo: MemoType): Promise<MemoType>
  deleteMemo(memoId: number): Promise<MemoType>
}

export interface MemoLocalRepositoryPort {
  getAllMemosLocal(): MemoType[]
  setMemo(memo: MemoType): void
  setAllMemosLocal(memos: MemoType[]): void
  deleteMemoLocal(memoId: number): void
}
