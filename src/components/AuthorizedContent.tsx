import { JSX, ReactNode } from 'react'

import { authService } from '@/domain/auth/di'
import { lockFacade } from '@/domain/lock/facade'

/**
 * 인증되어있지 않다면 화면을 가리고 데이터를 요청하지 않도록 막아주는 컴포넌트
 * 1. 인증되어있지 않을 시 unauthorizedComponent 가 있다면 표시, 없다면 빈 화면
 * 2. 인증되어있고 잠금 상태가 아닐 시 children 표시
 */
export function AuthorizedContent({
  children,
  unauthorizedComponent,
}: {
  children: ReactNode
  unauthorizedComponent?: ReactNode
}): JSX.Element {
  const isAuthenticated = authService.isAuthenticated()
  const isLockedLocal = lockFacade.store.watchIsLockedLocal()

  if (!isAuthenticated) {
    return <>{unauthorizedComponent ?? null}</>
  }

  if (isLockedLocal) {
    return <></>
  }

  return <>{children}</>
}
