import { localLockRepository } from '@/infra/lock/localRepository'
import { createLockQuery } from '@/infra/lock/query'
import { remoteLockRepository } from '@/infra/lock/remoteRepository'
import { lockStore } from '@/infra/lock/store'

import { createLockFacade } from './facade'
import { createLockService } from './service'

export const lockService = createLockService({
  remoteLockRepository: remoteLockRepository,
  localLockRepository: localLockRepository,
})

const lockQuery = createLockQuery(lockService)

export const lockFacade = createLockFacade({
  lockService,
  query: lockQuery,
  store: lockStore,
})
