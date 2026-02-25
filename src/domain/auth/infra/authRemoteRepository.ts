import { userApi } from '@/apis/userApi'
import { queryClient } from '@/lib/queryClient'

import { AuthRemoteRepository } from '../service'

export const authRemoteRepository: AuthRemoteRepository = {
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
