import { LoginResponseType } from '../apis/userApi'

export const isClient = typeof window !== 'undefined'
export const zIndex = {
  passwordScreen: 'z-[100]',
  commonModal: 'z-[1000]',
} as const

export function canCallApi(options: {
  // NOTE: 로그인 여부, 잠금 여부에 따라 API 호출 가능 여부를 판단하는 함수
  loginData?: LoginResponseType
  isLocked?: boolean
}): boolean {
  const { loginData, isLocked } = options

  // 로그인 데이터가 없으면 API 호출 불가
  if (!loginData) return false

  // 비밀번호 화면이 잠겨있으면 API 호출 불가
  if (isLocked) return false

  // 서버에서 locked가 true이면서 사용자가 잠금을 해제하지 않은 경우 API 호출 불가
  if (loginData.locked && isLocked !== false) return false

  return true
}
