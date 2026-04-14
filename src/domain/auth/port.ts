import type { LoginResponseType } from '@/apis/userApi'

/**
 * Auth port: service ↔ repository contract (DIP key)
 */

export interface AuthRemoteRepositoryPort {
  issueToken(oAuthCredential: OAuthCredential): Promise<string>
  checkLogin(): Promise<LoginResponseType>
  logout(): Promise<unknown>
}

export interface AuthLocalRepositoryPort {
  getAccessToken(): string
  setAccessToken(accessToken: string): void
  deleteAccessToken(): void
}

export interface OAuthClient {
  autoLogin(callback: (oAuthCredential: OAuthCredential) => Promise<void>): void
  renderLoginUi(divId: string): void
}

export type OAuthCredential = {
  credential: string
}

export type LoginCallback = (
  loginData: LoginResponseType
) => Promise<void> | void
