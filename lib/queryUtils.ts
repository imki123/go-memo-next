import {
  QueryKey,
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'

function createQueryKey<T extends (...args: unknown[]) => unknown>(
  queryFn: T,
  payload?: Parameters<T>[0] extends undefined ? undefined : Parameters<T>[0]
): QueryKey {
  const functionName = queryFn.name

  if (!functionName) {
    throw new Error('쿼리 함수는 명명된 함수여야 합니다.')
  }

  if (payload === undefined) {
    return [functionName]
  }

  if (typeof payload === 'object' && payload !== null) {
    return [functionName, ...Object.values(payload)]
  }

  return [functionName, payload]
}

export function useApiQuery<QueryFnInput, QueryFnOutput>({
  queryFn,
  payload,
  options,
}: {
  queryFn: (payload: QueryFnInput) => QueryFnOutput
  payload?: QueryFnInput
  options?: Omit<
    UseQueryOptions<Awaited<QueryFnOutput>, Error>,
    'queryKey' | 'queryFn'
  >
}) {
  const queryKey = createQueryKey(
    queryFn as (...args: unknown[]) => unknown,
    payload as unknown
  )

  return useQuery({
    queryKey,
    queryFn: () =>
      queryFn(payload as QueryFnInput) as Promise<Awaited<QueryFnOutput>>,
    ...options,
  })
}

export function useApiMutation<MutationFnInput, MutationFnOutput>({
  mutationFn,
  options,
}: {
  mutationFn: (payload: MutationFnInput) => MutationFnOutput
  options?: UseMutationOptions<
    Awaited<MutationFnOutput>,
    Error,
    MutationFnInput
  >
}) {
  return useMutation({
    mutationFn: (payload: MutationFnInput) =>
      mutationFn(payload) as Promise<Awaited<MutationFnOutput>>,
    ...options,
  })
}

export function useInvalidation() {
  const queryClient = useQueryClient()

  const invalidateQuery = <QueryFnInput, QueryFnOutput>({
    queryFn,
    payload,
  }: {
    queryFn: (payload: QueryFnInput) => QueryFnOutput
    payload?: QueryFnInput
  }) => {
    const queryKey = createQueryKey(
      queryFn as (...args: unknown[]) => unknown,
      payload as unknown
    )
    return queryClient.invalidateQueries({ queryKey })
  }

  const invalidateAll = () => {
    return queryClient.invalidateQueries()
  }

  return {
    invalidateQuery,
    invalidateAll,
  }
}
