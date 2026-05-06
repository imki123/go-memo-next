import type { MemoLocalRepositoryPort } from '@/domain/memo/port'
import { useAllMemosStore } from '@/infra/store/useAllMemosStore'

export const memoLocalRepository: MemoLocalRepositoryPort = {
  getAllMemosLocal: () => useAllMemosStore.getState().allMemos,
  setMemoLocal: (memo) => useAllMemosStore.getState().setMemo(memo),
  setAllMemosLocal: (memos) => useAllMemosStore.getState().setAllMemos(memos),
  deleteMemoLocal: (memoId) => useAllMemosStore.getState().deleteMemo(memoId),
}
