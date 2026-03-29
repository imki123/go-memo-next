import { userApi } from '@/apis/userApi'
import type { LockRemoteRepositoryPort } from '@/domain/lock/port'
import { queryClient } from '@/infra/query/queryClient'
import { queryKeys } from '@/infra/query/queryKeys'
import { queryWhenStaleOrMissing } from '@/infra/query/queryUtils'

export const lockRemoteRepository: LockRemoteRepositoryPort = {
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
