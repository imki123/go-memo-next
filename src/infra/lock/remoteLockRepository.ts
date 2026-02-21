import { userApi } from '@/apis/userApi'
import { RemoteLockRepository } from '@/domains/lock/service'

export const remoteLockRepository: RemoteLockRepository = {
  getIsLockedRemote: async () => (await userApi.checkLogin()).locked ?? false,
  enableRemote: userApi.setLock,
  disableRemote: userApi.removeLock,
  unlockRemote: userApi.unlock,
}
