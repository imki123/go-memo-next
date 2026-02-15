import { LoginResponseType } from '@/apis/userApi'

import { AuthEntity, authEntity } from './entity'

/**
 * 인증 서비스: 유저의 동작 흐름을 정의한다. 서비스 인스턴스 생성시 외부 의존성을 주입한다.
 * 1. 로그인(가입): oAuthClient 자동로그인/로그인UI렌더링 -> tokenApi 토큰 발급 -> accessTokenRepository 저장 -> signUpCompleteHandler 완료 처리
 * 2. 로그아웃
 * 3. 토큰 조회, 저장, 삭제
 */

export type AuthService = {
  renderLoginUi: OAuthClient['renderLoginUi']
  autoLogin: (loginCallback: LoginCallback) => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => string
  setAccessToken: (accessToken: string) => void
  deleteAccessToken: () => void
} & AuthEntity

export function createAuthService({
  oAuthClient,
  authApi,
  accessTokenRepository,
}: {
  oAuthClient: OAuthClient
  authApi: AuthApi
  accessTokenRepository: AccessTokenRepository
}): AuthService {
  return {
    renderLoginUi: oAuthClient.renderLoginUi,

    autoLogin: async (loginCallback: LoginCallback) => {
      const oAuthCredential = await new Promise<OAuthCredential>((resolve) => {
        oAuthClient.autoLogin(async (info) => {
          resolve(info)
        })
      })
      try {
        const accessToken = await Promise.resolve(
          authApi.issueToken(oAuthCredential)
        )
        accessTokenRepository.setAccessToken(accessToken)

        if (!accessToken) {
          throw new Error('토큰 발급 실패')
        }
      } catch (error) {
        console.error(error)
        accessTokenRepository.setAccessToken('')
        throw new Error('토큰 발급 실패')
      }

      const loginData = await authApi.checkLogin()

      if (!loginData) {
        throw new Error('로그인 실패')
      }

      if (loginData.token) {
        accessTokenRepository.setAccessToken(loginData.token)
      }

      await Promise.resolve(loginCallback(loginData))
    },

    logout: async () => {
      accessTokenRepository.deleteAccessToken()
      await authApi.logout()
    },

    getAccessToken: () => accessTokenRepository.getAccessToken(),
    setAccessToken: (accessToken: string) => {
      accessTokenRepository.setAccessToken(accessToken)
    },
    deleteAccessToken: () => {
      accessTokenRepository.deleteAccessToken()
    },

    isAuthenticated: () =>
      authEntity.isAuthenticated(accessTokenRepository.getAccessToken()),
  }
}

export type OAuthCredential = {
  credential: string
}

export type OAuthClient = {
  autoLogin(callback: (oAuthCredential: OAuthCredential) => Promise<void>): void
  renderLoginUi(divId: string): void
}

export type AuthApi = {
  issueToken(oAuthCredential: OAuthCredential): Promise<string>
  checkLogin(): Promise<LoginResponseType>
  logout(): Promise<unknown>
}

export type AccessTokenRepository = {
  getAccessToken(): string
  setAccessToken(accessToken: string): void
  deleteAccessToken(): void
}

export type LoginCallback = (
  loginData: LoginResponseType
) => Promise<void> | void
