import type { QueryKey } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'

export function queryWhenStaleOrMissing<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>
): Promise<T> {
  const state = queryClient.getQueryState(queryKey)
  const cachedData = queryClient.getQueryData<T>(queryKey)
  const staleTime =
    (queryClient.getDefaultOptions().queries?.staleTime as number) ?? 0
  const isFresh =
    typeof staleTime === 'number' &&
    cachedData !== undefined &&
    state?.dataUpdatedAt != null &&
    Date.now() - state.dataUpdatedAt < staleTime
  if (isFresh) return Promise.resolve(cachedData)
  return queryClient.fetchQuery({ queryKey, queryFn })
}
