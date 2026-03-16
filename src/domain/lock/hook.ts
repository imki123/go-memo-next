import { useMutation, useQuery } from '@tanstack/react-query'

import { userApi } from '@/apis/userApi'
import { queryKeys } from '@/infra/query/queryKeys'
import { useLockStore } from '@/infra/store/useLockStore'

import { LockScreenType, lockService } from './service'

export function useLockService(options?: { enabled?: boolean }) {
  const isLockedLocal = useLockStore((s) => s.isLockedLocal)
  const isLockScreenOpened = useLockStore((s) => s.isLockScreenOpened)
  const lockScreenType = useLockStore((s) => s.lockScreenType)

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: async () => await userApi.checkLogin(),
    enabled: options?.enabled,
  })

  const enableRemote = useMutation({
    mutationFn: (password: string) => lockService.enableRemote(password),
  })

  const disableRemote = useMutation({
    mutationFn: () => lockService.disableRemote(),
  })

  const unlockRemote = useMutation({
    mutationFn: (password: string) => lockService.unlockRemote(password),
  })

  const shouldShowLockScreen = () => lockService.shouldShowLockScreen()
  const getLockedStatus = () => lockService.getLockedStatus()
  const getIsLockedLocal = () => lockService.getIsLockedLocal()
  const setIsLockedLocal = (isLockedLocal: boolean | undefined) =>
    lockService.setIsLockedLocal(isLockedLocal)
  const getCurrentLockScreenType = () => lockService.getCurrentLockScreenType()
  const getIsLockScreenOpened = () => lockService.getIsLockScreenOpened()
  const showLockScreen = (screenType: LockScreenType) =>
    lockService.showLockScreen(screenType)
  const hideLockScreen = () => lockService.hideLockScreen()
  const isApiCallAllowed = lockService.isApiCallAllowed.bind(lockService)

  return {
    // store state
    isLockedLocal,
    isLockScreenOpened,
    lockScreenType,
    // query
    lockedStatus: {
      data: data?.locked ?? false,
      isFetching,
      isError,
      refetch,
    },
    // service actions
    enableRemote,
    disableRemote,
    unlockRemote,
    shouldShowLockScreen,
    getLockedStatus,
    getIsLockedLocal,
    setIsLockedLocal,
    getCurrentLockScreenType,
    getIsLockScreenOpened,
    showLockScreen,
    hideLockScreen,
    isApiCallAllowed,
  }
}
