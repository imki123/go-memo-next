import { useMutation, useQuery } from '@tanstack/react-query'

import { userApi } from '@/apis/userApi'
import { queryKeys } from '@/infra/query/queryKeys'
import { useLockStore } from '@/infra/store/useLockStore'

import { lockEntity } from './entity'
import { localLockRepository } from './repositories/localRepository'
import { remoteLockRepository } from './repositories/remoteRepository'
import { LockScreenType, LockService } from './service'

const lockService = new LockService(remoteLockRepository, localLockRepository)

export function useLockScreenState() {
  const isLockedLocal = useLockStore((s) => s.isLockedLocal)
  const isLockScreenOpened = useLockStore((s) => s.isLockScreenOpened)
  const lockScreenType = useLockStore((s) => s.lockScreenType)

  return {
    isLockedLocal,
    isLockScreenOpened,
    lockScreenType,
  }
}

export function useLockQueries(options?: { enabled?: boolean }) {
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: async () => await userApi.checkLogin(),
    enabled: options?.enabled,
  })

  return {
    lockedStatus: {
      data: data?.locked ?? false,
      isFetching,
      isError,
      refetch,
    },
  }
}

export function useLockActions() {
  const enableRemote = useMutation({
    mutationFn: (password: string) => lockService.enableRemote(password),
  })
  const disableRemote = useMutation({
    mutationFn: () => lockService.disableRemote(),
  })
  const unlockRemote = useMutation({
    mutationFn: (password: string) => lockService.unlockRemote(password),
  })

  return {
    enableRemote,
    disableRemote,
    unlockRemote,
    isApiCallAllowed: lockEntity.isApiCallAllowed,
    setIsLockedLocal: (isLockedLocal: boolean | undefined) =>
      lockService.setIsLockedLocal(isLockedLocal),
    showLockScreen: (screenType: LockScreenType) =>
      lockService.showLockScreen(screenType),
    hideLockScreen: () => lockService.hideLockScreen(),
  }
}
