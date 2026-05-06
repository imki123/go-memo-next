import type { MemoEntity } from '@/domain/memo/entity'

export interface MemoRemoteRepositoryPort {
  getAllMemos(): Promise<MemoEntity[]>
  getMemo(memoId: number): Promise<MemoEntity | undefined>
  createMemo(): Promise<MemoEntity>
  updateMemo(memo: MemoEntity): Promise<MemoEntity>
  deleteMemo(memoId: number): Promise<MemoEntity>
}

export interface MemoLocalRepositoryPort {
  getAllMemosLocal(): MemoEntity[]
  setMemo(memo: MemoEntity): void
  setAllMemosLocal(memos: MemoEntity[]): void
  deleteMemoLocal(memoId: number): void
}
