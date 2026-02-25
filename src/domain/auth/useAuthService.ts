import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'

import { LoginResponseType, userApi } from '@/apis/userApi'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/zustand/useAuthStore'

type UseAuthService = {
  state: {
    accessToken: string
    isAuthenticated: boolean
  }
  action: {
    logout: () => Promise<unknown>
    setAccessToken: (accessToken: string) => void
    deleteAccessToken: () => void
  }
  raw: {
    store: ReturnType<typeof useAuthStore>
    query: {
      checkLoginQuery: UseQueryResult<LoginResponseType>
      logoutMutation: UseMutationResult<unknown, Error, void, unknown>
    }
  }
}

export function useAuthService(): UseAuthService {
  // NOTE: 리액트와 동기화시키기 위한 서비스.
  // TODO: authService 를 주입해서 구현해야함.
  const authStore = useAuthStore()

  const checkLoginQuery = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: userApi.checkLogin,
  })
  const logoutMutation = useMutation({
    mutationFn: userApi.logout,
  })

  return {
    state: {
      accessToken: authStore.accessToken,
      isAuthenticated: Boolean(authStore.accessToken),
    },
    action: {
      logout: logoutMutation.mutateAsync,
      setAccessToken: (accessToken: string) =>
        authStore.setAccessToken(accessToken),
      deleteAccessToken: () => authStore.setAccessToken(''),
    },
    raw: {
      store: authStore,
      query: {
        checkLoginQuery,
        logoutMutation,
      },
    },
  }
}
