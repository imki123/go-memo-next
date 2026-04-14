import { memoApi } from '@/apis/memoApi'
import type { MemoRemoteRepositoryPort } from '@/domain/memo/port'
import { queryClient } from '@/infra/query/queryClient'
import { queryKeys } from '@/infra/query/queryKeys'

export const memoRemoteRepository: MemoRemoteRepositoryPort = {
  getAllMemos: async () => {
    const data = await memoApi.getAllMemo()
    return data
  },

  getMemo: async (memoId: number) => {
    const data = await memoApi.getMemo(memoId)
    return data
  },

  createMemo: async () => {
    const data = await memoApi.postMemo()
    queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
    return data
  },

  updateMemo: async (memo) => {
    const data = await memoApi.patchMemo(memo)
    return data
  },

  deleteMemo: async (memoId: number) => {
    const data = await memoApi.deleteMemo(memoId)
    queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
    return data
  },
}
