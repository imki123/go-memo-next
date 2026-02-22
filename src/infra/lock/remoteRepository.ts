import type { QueryClient } from '@tanstack/react-query'

import { userApi } from '@/apis/userApi'
import type { LockRemoteRepository } from '@/domains/lock/service'

import { lockKeys } from './query'

type LockApiClient = {
  getLockedStatus: () => Promise<boolean>
  setLock: (password: string) => Promise<unknown>
  removeLock: () => Promise<unknown>
  unlock: (password: string) => Promise<unknown>
}

const lockApiClient: LockApiClient = {
  getLockedStatus: async () => (await userApi.checkLogin())?.locked ?? false,
  setLock: userApi.setLock,
  removeLock: userApi.removeLock,
  unlock: userApi.unlock,
}

export type LoginStatusQueryKey = readonly [string, string, ...string[]]

export class QueryLockRemoteRepository implements LockRemoteRepository {
  constructor(
    private readonly queryClient: QueryClient,
    private readonly api: LockApiClient,
    private readonly loginStatusKey: LoginStatusQueryKey
  ) {}

  async getLockedStatus(): Promise<boolean> {
    return this.queryClient.ensureQueryData({
      queryKey: this.loginStatusKey,
      queryFn: () => this.api.getLockedStatus(),
    })
  }

  async enableRemote(password: string): Promise<void> {
    await this.api.setLock(password)
    this.queryClient.setQueryData(this.loginStatusKey, true)
  }

  async disableRemote(): Promise<void> {
    await this.api.removeLock()
    this.queryClient.setQueryData(this.loginStatusKey, false)
  }

  async unlockRemote(password: string): Promise<void> {
    await this.api.unlock(password)
  }
}

export function createRemoteLockRepository(queryClient: QueryClient) {
  return new QueryLockRemoteRepository(
    queryClient,
    lockApiClient,
    lockKeys.loginStatus()
  )
}
