import { createLockQuery } from '@/domain/lock/infra/query'
import { lockStore } from '@/domain/lock/infra/store'

import { lockService } from './di'
import { IsLockedLocalStatus } from './entity'
import type { LockScreenType } from './service'

export type LockedStatusResult = {
  data: boolean | undefined
  isFetching: boolean
  isError: boolean
  refetch: () => void
}

export type LockQuery = {
  useLockedStatus: (options?: { enabled: boolean }) => LockedStatusResult
  useLockMutations: () => {
    enableRemote: { mutateAsync: (password: string) => Promise<unknown> }
    disableRemote: { mutateAsync: () => Promise<unknown> }
    unlockRemote: { mutateAsync: (password: string) => Promise<unknown> }
  }
}

export type LockStore = {
  useIsLockedLocal: () => IsLockedLocalStatus
  useIsLockScreenOpened: () => boolean
  useLockScreenType: () => LockScreenType
  setIsLockedLocal: (isLockedLocal: IsLockedLocalStatus) => void
  showLockScreen: (screenType: LockScreenType) => void
  hideLockScreen: () => void
}

const lockQuery = createLockQuery(lockService)

export const lockFacade = {
  service: lockService,
  query: lockQuery,
  store: lockStore,
}
