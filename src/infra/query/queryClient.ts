import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000, // 5초
      gcTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
})
