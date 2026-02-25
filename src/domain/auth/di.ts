import { authLocalRepository } from '@/domain/auth/infra/authLocalRepository'
import { googleAccountClient } from '@/domain/auth/infra/googleAccountClient'

import { authRemoteRepository } from './infra/authRemoteRepository'
import { createAuthService } from './service'

/**
 * 인증 서비스 의존성 주입
 * 1. OAuthClient: 소셜 로그인 클라이언트
 * 2. AuthApi: 인증 API
 * 3. AccessTokenRepository: 액세스 토큰 저장소
 */
export const authService = createAuthService({
  oAuthClient: googleAccountClient,
  authRemoteRepository: authRemoteRepository,
  authLocalRepository: authLocalRepository,
})
