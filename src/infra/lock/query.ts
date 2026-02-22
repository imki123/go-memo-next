import { useMutation, useQuery } from '@tanstack/react-query'

import { LockQuery } from '@/domain/lock/facade'
import type { LockService } from '@/domain/lock/service'

export const lockKeys = {
  all: ['lock'] as const,
  loginStatus: () => [...lockKeys.all, 'loginStatus'] as const,
}

export function createLockQuery(lockService: LockService): LockQuery {
  return {
    useLockedStatus() {
      return useQuery({
        queryKey: lockKeys.loginStatus(),
        queryFn: () => lockService.getLockedStatus(),
      })
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
