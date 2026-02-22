export type LockEntity = {
  // 화면에 잠금을 보여줘야하는가: 잠금설정이 되어있고, 잠금이 해제되었는지 여부에 따라 결정
  shouldShowLockScreen: ({
    isLockedRemote,
    isLockedLocal,
  }: {
    isLockedRemote: boolean
    isLockedLocal: boolean
  }) => Promise<boolean>
}

export const lockEntity: LockEntity = {
  shouldShowLockScreen: async ({ isLockedRemote, isLockedLocal }) => {
    if (isLockedRemote && isLockedLocal) {
      return true
    }
    return false
  },
}
