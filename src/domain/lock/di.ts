import { localLockRepository } from '@/infra/lock/localRepository'
import { remoteLockRepository } from '@/infra/lock/remoteRepository'

import { createLockService } from './service'

export const lockService = createLockService({
  remoteLockRepository: remoteLockRepository,
  localLockRepository: localLockRepository,
})
