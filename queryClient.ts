import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 2,
    },
    mutations: {
      retry: false,
    },
  },
})

export const queryKeys = {
  checkLogin: ['checkLogin'],
  getAllMemo: ['getAllMemo'],
  getMemo: ['getMemo'],
  postMemo: ['postMemo'],
  patchMemo: ['patchMemo'],
  deleteMemo: ['deleteMemo'],
}
