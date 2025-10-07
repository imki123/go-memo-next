import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { getAllMemo } from '../apis/memo'
import { MemoType } from '../components/molecules/Memo'
import { queryKeys } from '../queryClient'

export const useGetAllMemo = (options?: UseQueryOptions<MemoType[]>) =>
  useQuery<MemoType[]>(queryKeys.getAllMemo, getAllMemo, options)
