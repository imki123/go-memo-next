import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { MemoModel } from '../component/molecule/Memo'
import { getAllMemo } from '../api/memo'
import { queryKeys } from '../queryClient'

export const useGetAllMemo = (options?: UseQueryOptions<MemoModel[]>) =>
  useQuery<MemoModel[]>(queryKeys.getAllMemo, getAllMemo, options)
