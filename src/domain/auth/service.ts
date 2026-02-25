import { LoginResponseType } from '@/apis/userApi'

/**
 * 인증 서비스: 유저의 동작 흐름을 정의한다. 서비스 인스턴스 생성시 외부 의존성을 주입한다.
 * 1. 로그인(가입): oAuthClient 자동로그인/로그인UI렌더링 -> tokenApi 토큰 발급 -> accessTokenRepository 저장 -> signUpCompleteHandler 완료 처리
 * 2. 로그아웃
 * 3. 토큰 조회, 저장, 삭제
 */

export type AuthService = {
  renderLoginUi: OAuthClient['renderLoginUi']
  autoLogin: (loginCallback: LoginCallback) => Promise<void>
}

export function createAuthService({
  oAuthClient,
  authRemoteRepository,
  authLocalRepository,
}: {
  oAuthClient: OAuthClient
  authRemoteRepository: AuthRemoteRepository
  authLocalRepository: AuthLocalRepository
}): AuthService {
  return {
    renderLoginUi: oAuthClient.renderLoginUi,
    autoLogin: async (loginCallback: LoginCallback) => {
      const oAuthCredential = await new Promise<OAuthCredential>((resolve) => {
        oAuthClient.autoLogin(async (oAuthCredential) => {
          resolve(oAuthCredential)
        })
      })
      try {
        const accessToken = await Promise.resolve(
          authRemoteRepository.issueToken(oAuthCredential)
        )
        authLocalRepository.setAccessToken(accessToken)

        if (!accessToken) {
          throw new Error('토큰 발급 실패')
        }
      } catch (error) {
        console.error(error)
        authLocalRepository.setAccessToken('')
        throw new Error('토큰 발급 실패')
      }

      const loginData = await authRemoteRepository.checkLogin()

      if (!loginData?.token) {
        throw new Error('로그인 실패')
      }

      if (loginData.token) {
        authLocalRepository.setAccessToken(loginData.token)
      }

      await Promise.resolve(loginCallback(loginData))
    },
  }
}

export type OAuthCredential = {
  credential: string
}

export type OAuthClient = {
  autoLogin(callback: (oAuthCredential: OAuthCredential) => Promise<void>): void
  renderLoginUi(divId: string): void
}

export type AuthRemoteRepository = {
  issueToken(oAuthCredential: OAuthCredential): Promise<string>
  checkLogin(): Promise<LoginResponseType>
  logout(): Promise<unknown>
}

export type AuthLocalRepository = {
  getAccessToken(): string
  setAccessToken(accessToken: string): void
  deleteAccessToken(): void
}

export type LoginCallback = (
  loginData: LoginResponseType
) => Promise<void> | void
