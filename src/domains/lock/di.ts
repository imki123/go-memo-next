import { localLockRepository } from '@/infra/lock/localLockRepository'
import { remoteLockRepository } from '@/infra/lock/remoteLockRepository'

import { createLockService } from './service'

export const lockService = createLockService({
  remoteLockRepository,
  localLockRepository,
})
