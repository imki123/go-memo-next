import { userApi } from '@/apis/userApi'
import { accessTokenRepository } from '@/infra/auth/accessTokenRepository'
import { googleAccountClient } from '@/infra/auth/googleAccountClient'
import { queryClient } from '@/lib/queryClient'

import { createAuthService } from './service'

/**
 * 인증 서비스 의존성 주입
 * 1. OAuthClient: 소셜 로그인 클라이언트
 * 2. AuthApi: 인증 API
 * 3. AccessTokenRepository: 액세스 토큰 저장소
 */
export const authService = createAuthService({
  oAuthClient: googleAccountClient,
  remoteRepository: {
    issueToken: async (oAuthCredential) => {
      const data = await userApi.login(oAuthCredential?.credential ?? '')
      return data?.token ?? ''
    },
    checkLogin: userApi.checkLogin,
    logout: async () => {
      await userApi.logout()
      queryClient.invalidateQueries()
    },
  },
  accessTokenRepository,
})
