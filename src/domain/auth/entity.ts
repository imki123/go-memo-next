/**
 * 인증 엔티티: 규칙, 정책, 상태, 행동을 정의한다.
 * 1. 인증이 되었는지 여부
 */

export type AuthEntity = {
  isAuthenticated(accessToken: string): boolean
}

export const authEntity: AuthEntity = {
  isAuthenticated: (accessToken: string): boolean => {
    return Boolean(accessToken)
  },
}
