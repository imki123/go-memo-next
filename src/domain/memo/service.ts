import type { MemoEntity } from '@/domain/memo/entity'

import { MemoLocalRepositoryPort, MemoRemoteRepositoryPort } from './port'
import { memoLocalRepository } from './repositories/localRepository'
import { memoRemoteRepository } from './repositories/remoteRepository'

export class MemoService {
  constructor(
    private readonly remoteMemoRepository: MemoRemoteRepositoryPort,
    private readonly localMemoRepository: MemoLocalRepositoryPort
  ) {}

  async getAllMemos(): Promise<MemoEntity[]> {
    return this.remoteMemoRepository.getAllMemos()
  }

  async getMemo(memoId: number): Promise<MemoEntity | undefined> {
    return this.remoteMemoRepository.getMemo(memoId)
  }

  async createMemo(): Promise<MemoEntity> {
    return this.remoteMemoRepository.createMemo()
  }

  async updateMemo(memo: MemoEntity): Promise<MemoEntity> {
    return this.remoteMemoRepository.updateMemo(memo)
  }

  async deleteMemo(memoId: number): Promise<MemoEntity> {
    return this.remoteMemoRepository.deleteMemo(memoId)
  }

  getAllMemosLocal(): MemoEntity[] {
    return this.localMemoRepository.getAllMemosLocal()
  }

  setMemoLocal(memo: MemoEntity): void {
    this.localMemoRepository.setMemoLocal(memo)
  }

  setAllMemosLocal(memos: MemoEntity[]): void {
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
