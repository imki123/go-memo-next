import type { MemoType } from '@/shared/components/home/Memo'

import { MemoLocalRepositoryPort, MemoRemoteRepositoryPort } from './port'
import { memoLocalRepository } from './repositories/localRepository'
import { memoRemoteRepository } from './repositories/remoteRepository'

export class MemoService {
  constructor(
    private readonly remoteMemoRepository: MemoRemoteRepositoryPort,
    private readonly localMemoRepository: MemoLocalRepositoryPort
  ) {}

  async getAllMemos(): Promise<MemoType[]> {
    return this.remoteMemoRepository.getAllMemos()
  }

  async getMemo(memoId: number): Promise<MemoType | undefined> {
    return this.remoteMemoRepository.getMemo(memoId)
  }

  async createMemo(): Promise<MemoType> {
    return this.remoteMemoRepository.createMemo()
  }

  async updateMemo(memo: MemoType): Promise<MemoType> {
    return this.remoteMemoRepository.updateMemo(memo)
  }

  async deleteMemo(memoId: number): Promise<MemoType> {
    return this.remoteMemoRepository.deleteMemo(memoId)
  }

  getAllMemosLocal(): MemoType[] {
    return this.localMemoRepository.getAllMemosLocal()
  }

  setMemo(memo: MemoType): void {
    this.localMemoRepository.setMemo(memo)
  }

  setAllMemosLocal(memos: MemoType[]): void {
    this.localMemoRepository.setAllMemosLocal(memos)
  }

  deleteMemoLocal(memoId: number): void {
    this.localMemoRepository.deleteMemoLocal(memoId)
  }
}

export const memoService = new MemoService(
  memoRemoteRepository,
  memoLocalRepository
)
