import { localLockRepository } from '@/domain/lock/infra/localRepository'
import { remoteLockRepository } from '@/domain/lock/infra/remoteRepository'

import { createLockService } from './service'

export const lockService = createLockService({
  remoteLockRepository: remoteLockRepository,
  localLockRepository: localLockRepository,
})
