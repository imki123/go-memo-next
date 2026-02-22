import type { LockScreenType, LockService } from './service'

export type LockedStatusResult = {
  data: boolean | undefined
  isFetching: boolean
  isError: boolean
  refetch: () => void
}

export type LockQueryApi = {
  useLockedStatus: () => LockedStatusResult
  useLockMutations: () => {
    enableRemote: { mutateAsync: (password: string) => Promise<unknown> }
    disableRemote: { mutateAsync: () => Promise<unknown> }
    unlockRemote: { mutateAsync: (password: string) => Promise<unknown> }
  }
}

export type LockStoreApi = {
  useIsLockedLocal: () => boolean | undefined
  useLockScreenOpened: () => boolean
  useLockScreenType: () => LockScreenType
  setIsLockedLocal: (v: boolean) => void
  showLockScreen: (screenType: LockScreenType) => void
  hideLockScreen: () => void
}

export function createLockFacade({
  lockService,
  query,
  store,
}: {
  lockService: LockService
  query: LockQueryApi
  store: LockStoreApi
}) {
  return {
    lockService,
    query,
    store,
  }
}
