import { AuthLocalRepository } from '@/domain/auth/service'
import { useAuthStore } from '@/zustand/useAuthStore'

export const authStore: AuthLocalRepository = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (accessToken: string) => {
    useAuthStore.setState({ accessToken })
  },
  deleteAccessToken: () => {
    useAuthStore.setState({ accessToken: '' })
  },
}

export const authLocalRepository: AuthLocalRepository = authStore
