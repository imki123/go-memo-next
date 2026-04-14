import { userApi } from '@/apis/userApi'
import type { AuthRemoteRepositoryPort } from '@/domain/auth/port'
import { queryClient } from '@/infra/query/queryClient'

export const authRemoteRepository: AuthRemoteRepositoryPort = {
  issueToken: async (oAuthCredential) => {
    const data = await userApi.login(oAuthCredential?.credential ?? '')
    return data?.token ?? ''
  },
  checkLogin: userApi.checkLogin,
  logout: async () => {
    await userApi.logout()
    queryClient.invalidateQueries()
  },
}
