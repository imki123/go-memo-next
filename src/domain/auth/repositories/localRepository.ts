import type { AuthLocalRepositoryPort } from '@/domain/auth/port'
import { useAuthStore } from '@/infra/store/useAuthStore'

export const authLocalRepository: AuthLocalRepositoryPort = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (accessToken) => {
    useAuthStore.setState({ accessToken })
  },
  deleteAccessToken: () => {
    useAuthStore.setState({ accessToken: '' })
  },
}
