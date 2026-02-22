import { userApi } from '@/apis/userApi'
import type { LockRemoteRepository } from '@/domains/lock/service'
import { queryClient } from '@/lib/queryClient'

import { lockKeys } from './query'

export const remoteLockRepository: LockRemoteRepository = {
  getLockedStatus: async () => (await userApi.checkLogin())?.locked ?? false,
  enableRemote: async (password) => {
    await userApi.setLock(password)
    queryClient.setQueryData(lockKeys.loginStatus(), true)
  },
  disableRemote: async () => {
    await userApi.removeLock()
    queryClient.setQueryData(lockKeys.loginStatus(), false)
  },
  unlockRemote: async (password) => {
    await userApi.unlock(password)
  },
}
