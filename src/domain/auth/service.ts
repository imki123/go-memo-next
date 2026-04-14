import { googleAccountClient } from './infra/googleAccountClient'
import {
  AuthLocalRepositoryPort,
  AuthRemoteRepositoryPort,
  LoginCallback,
  OAuthClient,
  OAuthCredential,
} from './port'
import { authLocalRepository } from './repositories/localRepository'
import { authRemoteRepository } from './repositories/remoteRepository'

export class AuthService {
  constructor(
    private readonly remoteRepository: AuthRemoteRepositoryPort,
    private readonly localRepository: AuthLocalRepositoryPort,
    private readonly oAuthClient: OAuthClient
  ) {}

  async autoLogin(loginCallback: LoginCallback): Promise<void> {
    const credential = await new Promise<OAuthCredential>((resolve) => {
      this.oAuthClient.autoLogin(async (cred) => {
        resolve(cred)
      })
    })

    try {
      const token = await this.remoteRepository.issueToken(credential)
      this.localRepository.setAccessToken(token)

      if (!token) {
        throw new Error('토큰 발급 실패')
      }
    } catch (error) {
      console.error(error)
      this.localRepository.setAccessToken('')
      throw new Error('토큰 발급 실패')
    }

    const loginData = await this.remoteRepository.checkLogin()

    if (!loginData?.token) {
      throw new Error('로그인 실패')
    }

    if (loginData.token) {
      this.localRepository.setAccessToken(loginData.token)
    }

    await loginCallback(loginData)
  }

  renderLoginUi(divId: string): void {
    this.oAuthClient.renderLoginUi(divId)
  }

  async checkLogin() {
    return this.remoteRepository.checkLogin()
  }

  async logout() {
    const result = await this.remoteRepository.logout()
    this.localRepository.deleteAccessToken()
    return result
  }

  getAccessToken(): string {
    return this.localRepository.getAccessToken()
  }

  setAccessToken(token: string): void {
    this.localRepository.setAccessToken(token)
  }

  deleteAccessToken(): void {
    this.localRepository.deleteAccessToken()
  }

  isAuthenticated(): boolean {
    return Boolean(this.localRepository.getAccessToken())
  }
}

export const authService = new AuthService(
  authRemoteRepository,
  authLocalRepository,
  googleAccountClient
)
