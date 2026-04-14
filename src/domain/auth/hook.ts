import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'


import { queryKeys } from '@/infra/query/queryKeys'
import { useAuthStore } from '@/infra/store/useAuthStore'

import { LoginCallback } from './port'
import { authService } from './service'

export function useAuthService() {
  const authStore = useAuthStore()

  const checkLoginQuery = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: () => authService.checkLogin(),
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
  })

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  const setAccessToken = useCallback((token: string) => {
    authService.setAccessToken(token)
  }, [])

  const deleteAccessToken = useCallback(() => {
    authService.deleteAccessToken()
  }, [])

  const renderLoginUi = useCallback((divId: string) => {
    authService.renderLoginUi(divId)
  }, [])

  const autoLogin = useCallback((loginCallback: LoginCallback) => {
    return authService.autoLogin(loginCallback)
  }, [])

  return {
    state: {
      accessToken: authStore.accessToken,
      isAuthenticated: authService.isAuthenticated(),
    },
    action: {
      logout,
      setAccessToken,
      deleteAccessToken,
      renderLoginUi,
      autoLogin,
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
