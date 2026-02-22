import { createLockQuery } from '@/infra/lock/query'
import { lockStore } from '@/infra/lock/store'

import { lockService } from './di'
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
  watchIsLockedLocal: () => boolean | undefined
  watchLockScreenOpened: () => boolean
  watchLockScreenType: () => LockScreenType
  setIsLockedLocal: (v: boolean) => void
  showLockScreen: (screenType: LockScreenType) => void
  hideLockScreen: () => void
}

const lockQuery = createLockQuery(lockService)

export const lockFacade = {
  service: lockService,
  query: lockQuery,
  store: lockStore,
}
