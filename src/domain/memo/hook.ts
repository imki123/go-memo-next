import { useMutation, useQuery } from '@tanstack/react-query'

import type { MemoEntity } from '@/domain/memo/entity'
import { queryClient } from '@/infra/query/queryClient'
import { queryKeys } from '@/infra/query/queryKeys'

import { memoService } from './service'

export function useMemoService(options?: {
  enabled?: boolean
  memoId?: number
  shouldFetchAllMemos?: boolean
}) {
  const getAllMemosQuery = useQuery({
    queryKey: queryKeys.memoKeys.list(),
    queryFn: async () => await memoService.getAllMemos(),
    enabled: options?.enabled && options?.shouldFetchAllMemos,
  })

  const getMemoQuery = useQuery({
    queryKey: queryKeys.memoKeys.detail(options?.memoId ?? 0),
    queryFn: async () => await memoService.getMemo(options?.memoId ?? 0),
    enabled: !!options?.memoId && options.memoId > 0,
  })

  const getMemo = useMutation({
    mutationFn: (memoId: number) => memoService.getMemo(memoId),
  })

  const createMemo = useMutation({
    mutationFn: async () => await memoService.createMemo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
    },
  })

  const updateMemo = useMutation({
    mutationFn: (memo: MemoEntity) => memoService.updateMemo(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
    },
  })

  const deleteMemo = useMutation({
    mutationFn: (memoId: number) => memoService.deleteMemo(memoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
    },
  })

  const getAllMemosLocal = () => memoService.getAllMemosLocal()
  const setMemoLocal = (memo: MemoEntity) => memoService.setMemoLocal(memo)
  const setAllMemosLocal = (memos: MemoEntity[]) =>
    memoService.setAllMemosLocal(memos)
  const deleteMemoLocal = (memoId: number) =>
    memoService.deleteMemoLocal(memoId)

  return {
    getAllMemosQuery,
    getMemoQuery,
    getMemo,
    createMemo,
    updateMemo,
    deleteMemo,
    getAllMemosLocal,
    setMemoLocal,
    setAllMemosLocal,
    deleteMemoLocal,
    isLoading: getAllMemosQuery.isLoading,
    isFetching: getAllMemosQuery.isFetching,
  }
}
