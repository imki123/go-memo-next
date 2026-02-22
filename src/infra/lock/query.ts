import { useMutation, useQuery } from '@tanstack/react-query'

import { userApi } from '@/apis/userApi'
import { LockQuery } from '@/domain/lock/facade'
import type { LockService } from '@/domain/lock/service'
import { queryKeys } from '@/lib/queryKeys'

export function createLockQuery(lockService: LockService): LockQuery {
  return {
    useLockedStatus() {
      const { data, isFetching, isError, refetch } = useQuery({
        queryKey: queryKeys.userKeys.checkLogin(),
        queryFn: async () => await userApi.checkLogin(),
      })
      return {
        data: data?.locked ?? false,
        isFetching,
        isError,
        refetch,
      }
    },
    useLockMutations() {
      return {
        enableRemote: useMutation({
          mutationFn: (password: string) => lockService.enableRemote(password),
        }),
        disableRemote: useMutation({
          mutationFn: () => lockService.disableRemote(),
        }),
        unlockRemote: useMutation({
          mutationFn: (password: string) => lockService.unlockRemote(password),
        }),
      }
    },
  }
}
