import { AccessTokenRepository } from '@/domain/auth/service'
import { useAuthStore } from '@/zustand/useAuthStore'

export const authStore: AccessTokenRepository = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (accessToken: string) => {
    useAuthStore.setState({ accessToken })
  },
  deleteAccessToken: () => {
    useAuthStore.setState({ accessToken: '' })
  },
}

export const accessTokenRepository: AccessTokenRepository = authStore
