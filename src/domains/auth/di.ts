import { userApi } from '@/apis/userApi'
import { accessTokenRepository } from '@/infra/auth/accessTokenRepository'
import { googleAccountClient } from '@/infra/auth/googleAccountClient'

import { createAuthService } from './service'

export const authService = createAuthService({
  oAuthClient: googleAccountClient,
  tokenApi: {
    issueToken: async (authInfo) => {
      const data = await userApi.login(authInfo?.credential ?? '')
      return data?.token ?? ''
    },
    checkLogin: userApi.checkLogin,
    logout: userApi.logout,
  },
  accessTokenRepository,
})
