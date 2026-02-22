import { getLocalLockRepository } from '@/infra/lock/localRepository'
import { createLockQuery } from '@/infra/lock/query'
import { createRemoteLockRepository } from '@/infra/lock/remoteRepository'
import { lockStore } from '@/infra/lock/store'
import { queryClient } from '@/lib/queryClient'

import { createLockFacade } from './facade'
import { createLockService } from './service'

const remoteLockRepository = createRemoteLockRepository(queryClient)
const localLockRepository = getLocalLockRepository()

export const lockService = createLockService({
  remoteLockRepository,
  localLockRepository,
})

const lockQuery = createLockQuery(lockService)

export const lockFacade = createLockFacade({
  lockService,
  query: lockQuery,
  store: lockStore,
})
