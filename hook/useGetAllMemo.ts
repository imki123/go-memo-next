import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryKeys } from '../queryClient'
import { getAllMemo } from '../api/memo'
import { MemoModel } from '../component/Memo'

export const useGetAllMemo = (options?: UseQueryOptions<MemoModel[]>) =>
  useQuery<MemoModel[]>(queryKeys.getAllMemo, getAllMemo, options)
