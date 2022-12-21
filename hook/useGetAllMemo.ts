import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { getAllMemo } from '../api/memo'
import { MemoModel } from '../component/molecule/Memo'
import { queryKeys } from '../queryClient'

export const useGetAllMemo = (options?: UseQueryOptions<MemoModel[]>) =>
  useQuery<MemoModel[]>(queryKeys.getAllMemo, getAllMemo, options)
