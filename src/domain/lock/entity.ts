export type IsLockedLocalStatus = undefined | boolean // undefined: 초기상태, true: 잠금, false: 잠금해제

export type PasswordInput =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'DEL'
  | 'CLEAR'
  | 'SEND'

export const lockEntity = {
  // 비밀번호는 정확히 4자리 숫자
  PASSWORD_LENGTH: 4 as const,

  VALID_PASSWORD_INPUTS: [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'DEL', 'CLEAR', 'SEND',
  ] as readonly PasswordInput[],

  // 로컬 잠금 상태(undefined | true | false) 판별
  isLocalInitial: (s: IsLockedLocalStatus): s is undefined => s === undefined,
  isLocalLocked: (s: IsLockedLocalStatus): s is true => s === true,
  isLocalUnlocked: (s: IsLockedLocalStatus): s is false => s === false,

  // 화면에 잠금을 보여줘야하는가: 잠금설정이 되어있고, 잠금이 해제되었는지 여부에 따라 결정
  shouldShowLockScreen: ({
    isLockedRemote,
    isLockedLocal,
  }: {
    isLockedRemote: boolean
    isLockedLocal: IsLockedLocalStatus
  }): boolean => {
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

  isApiCallAllowed: (options: {
    isLockedRemote?: boolean
    isLockedLocal?: IsLockedLocalStatus
  }): boolean => {
    const { isLockedRemote, isLockedLocal } = options
    if (isLockedRemote === undefined) return false
    if (isLockedLocal) return false
    if (isLockedRemote && isLockedLocal !== false) return false
    return true
  },

  // 비밀번호 설정 가능 여부: 아직 비밀번호가 없을 때만 가능
  canEnableLock: (isLockedRemote: boolean): boolean => !isLockedRemote,

  // 비밀번호 삭제 가능 여부: 비밀번호가 설정된 경우에만 가능
  canDisableLock: (isLockedRemote: boolean): boolean => isLockedRemote,

  // 키패드 입력값 유효성 검사 (타입 가드)
  isValidPasswordInput: (value: string): value is PasswordInput =>
    (lockEntity.VALID_PASSWORD_INPUTS as readonly string[]).includes(value),

  // 비밀번호 전송 가능 여부: 정확히 PASSWORD_LENGTH 자리일 때
  isPasswordReady: (password: string): boolean =>
    password.length === lockEntity.PASSWORD_LENGTH,

  // 키패드 입력 하나를 적용해 새 비밀번호 문자열 반환
  applyPasswordInput: (current: string, input: PasswordInput): string => {
    if (input === 'DEL') return current.slice(0, -1)
    if (input === 'CLEAR') return ''
    if (input === 'SEND') return current
    if (current.length >= lockEntity.PASSWORD_LENGTH) return current
    return current + input
  },
}
