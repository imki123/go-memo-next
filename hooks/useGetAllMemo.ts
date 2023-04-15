import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { getAllMemo } from '../apis/memo'
import { MemoModel } from '../components/molecules/Memo'
import { queryKeys } from '../queryClient'

export const useGetAllMemo = (options?: UseQueryOptions<MemoModel[]>) =>
  useQuery<MemoModel[]>(queryKeys.getAllMemo, getAllMemo, options)
