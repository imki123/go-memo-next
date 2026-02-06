import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { persistStoreKeys } from '@/infra/persistStoreKeys'

type AuthStateType = {
  accessToken: string
}

type AuthActionType = {
  setAccessToken: (accessToken: string) => void
}

const initialState: AuthStateType = {
  accessToken: '',
}

export const useAuthStore = create<AuthStateType & AuthActionType>()(
  persist(
    (set) => ({
      ...initialState,

      setAccessToken: (accessToken: string) => set({ accessToken }),
    }),
    {
      name: persistStoreKeys.auth,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const authStore = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (accessToken: string) => {
    useAuthStore.setState({ accessToken })
  },
  deleteAccessToken: () => {
    useAuthStore.setState({ accessToken: '' })
  },
}
