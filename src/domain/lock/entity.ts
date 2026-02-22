export type LockEntity = {
  // 화면에 잠금을 보여줘야하는가: 잠금설정이 되어있고, 잠금이 해제되었는지 여부에 따라 결정
  shouldShowLockScreen: ({
    isLockedRemote,
    isLockedLocal,
  }: {
    isLockedRemote: boolean
    isLockedLocal: IsLockedLocalStatus
  }) => boolean
}

export type IsLockedLocalStatus = undefined | boolean // undefined: 초기상태, true: 잠금, false: 잠금해제

export const lockEntity: LockEntity = {
  shouldShowLockScreen: ({ isLockedRemote, isLockedLocal }) => {
    if (isLockedLocal === undefined) {
      // 로컬 잠금이 초기상태인 경우, 리모트 잠금 상태에 따라 결정
      if (isLockedRemote) {
        return true
      }
      return false
    } else {
      if (isLockedRemote && isLockedLocal) {
        return true
      }
      return false
    }
  },
}
