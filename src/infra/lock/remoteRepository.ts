import { userApi } from '@/apis/userApi'
import type { LockRemoteRepository } from '@/domain/lock/service'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import { queryWhenStaleOrMissing } from '@/lib/queryUtils'

export const remoteLockRepository: LockRemoteRepository = {
  getLockedStatus: async () => {
    const data = await queryWhenStaleOrMissing(
      queryKeys.userKeys.checkLogin(),
      async () => await userApi.checkLogin()
    )
    return data?.locked ?? false
  },

  enableRemote: async (password) => {
    await userApi.setLock(password)
    queryClient.invalidateQueries({ queryKey: queryKeys.userKeys.checkLogin() })
  },
  disableRemote: async () => {
    await userApi.removeLock()
    queryClient.invalidateQueries({ queryKey: queryKeys.userKeys.checkLogin() })
  },
  unlockRemote: async (password) => {
    await userApi.unlock(password)
  },
}
