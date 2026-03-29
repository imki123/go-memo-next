import { AxiosError } from 'axios'
import { Loader2, X } from 'lucide-react'
import { useCallback, useReducer, useState } from 'react'
import { toast } from 'sonner'

import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'
import { useThemeStore } from '@/infra/store/useThemeStore'
import { zIndex } from '@/shared/util/util'

export function LockScreen() {
  const {
    isLockedLocal,
    isLockScreenOpened,
    lockScreenType,
    lockedStatus,
    enableRemote,
    disableRemote,
    unlockRemote,
    setIsLockedLocal,
    hideLockScreen,
  } = useLockService()
  const { theme } = useThemeStore()
  const { refetch: refetchLogin } = lockedStatus
  const [isSending, setIsSending] = useState(false)

  const sendPassword = useCallback(
    async (currentPassword: string) => {
      if (!lockEntity.isPasswordReady(currentPassword)) {
        return
      }

      switch (lockScreenType) {
        case 'enable':
          if (window.confirm('비밀번호를 설정하시겠습니까?')) {
            try {
              setIsSending(true)
              await enableRemote.mutateAsync(currentPassword)
              setIsLockedLocal(false)
              refetchLogin()
              dispatchPassword('CLEAR')
              hideLockScreen()
            } catch (err) {
              const error = err as AxiosError<{ error: string }>
              console.error(err)
              toast.error(
                <>
                  비밀번호 설정에 실패했습니다.
                  <br />
                  {error.response?.data?.error || error.message}
                </>
              )
            } finally {
              setIsSending(false)
            }
          }
          return
        case 'disable':
          if (window.confirm('비밀번호를 삭제하시겠습니까?')) {
            try {
              setIsSending(true)
              await disableRemote.mutateAsync(currentPassword)
              setIsLockedLocal(false)
              refetchLogin()
              dispatchPassword('CLEAR')
              hideLockScreen()
            } catch (err) {
              const error = err as AxiosError<{ error: string }>
              console.error(err)
              toast.error(
                <>
                  비밀번호 삭제에 실패했습니다.
                  <br />
                  {error.response?.data?.error || error.message}
                </>
              )
            } finally {
              setIsSending(false)
            }
          }
          return
        case 'unlock':
          try {
            setIsSending(true)
            await unlockRemote.mutateAsync(currentPassword)
            setIsLockedLocal(false)
            dispatchPassword('CLEAR')
            hideLockScreen()
          } catch (err) {
            const error = err as AxiosError<{ error: string }>
            console.error(err)
            toast.error(
              <>
                잠금 해제에 실패했습니다.
                <br />
                {error.response?.data?.error || error.message}
              </>
            )
          } finally {
            setIsSending(false)
          }
          return
        default:
          return
      }
    },
    [
      lockScreenType,
      refetchLogin,
      enableRemote,
      disableRemote,
      unlockRemote,
      hideLockScreen,
      setIsLockedLocal,
    ]
  )

  const [password, dispatchPassword] = useReducer(
    (state: string, payload: string) => {
      if (!lockEntity.isValidPasswordInput(payload)) return state
      return lockEntity.applyPasswordInput(state, payload)
    },
    ''
  )

  const asteriskPassword =
    password.length > 0 ? '*'.repeat(password.length) : ''

  const passwordLengthText = `${lockEntity.PASSWORD_LENGTH}자리`

  if (!isLockedLocal && !isLockScreenOpened) {
    return null
  }

  return (
    <div
      className={`fixed top-[60px] bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] ${
        zIndex.lockScreen
      } p-4 flex flex-col justify-center items-center gap-6 select-none overflow-auto
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}
    >
      {(lockScreenType === 'enable' || lockScreenType === 'disable') && (
        <X
          className='absolute top-4 right-4 cursor-pointer'
          onClick={() => hideLockScreen()}
        />
      )}

      <div className='text-2xl font-bold'>
        {lockScreenType === 'enable'
          ? `비밀번호 설정 (${passwordLengthText})`
          : lockScreenType === 'disable'
            ? `비밀번호 삭제 확인 (${passwordLengthText})`
            : `메모 잠금 해제 (${passwordLengthText})`}
      </div>

      <div className='text-3xl font-bold py-2 px-4 h-[60px]'>
        {isSending ? <Loader2 className='animate-spin' /> : asteriskPassword}
      </div>

      <div
        className={`flex flex-col gap-2 select-none
          [&>div]:flex [&>div]:gap-2
          [&_span]:flex [&_span]:items-center [&_span]:justify-center [&_span]:text-2xl [&_span]:font-bold
          [&_span]:rounded-3xl [&_span]:cursor-pointer [&_span]:select-none [&_span]:no-drag
          [&_span]:flex-1 [&_span]:aspect-square
          ${
            theme === 'dark'
              ? '[&_span]:bg-gray-900 [&_span:hover]:bg-gray-950'
              : '[&_span]:bg-gray-100 [&_span:hover]:bg-gray-200'
          }
          `}
        style={{
          width: 'min(90vw, 50vh)',
          maxWidth: '300px',
        }}
        onClick={(e) => {
          e.stopPropagation()

          if (isSending) {
            return
          }

          const inputValue = (e.target as HTMLSpanElement)?.innerText
          if (!lockEntity.isValidPasswordInput(inputValue)) {
            return
          }

          const newPassword = lockEntity.applyPasswordInput(
            password,
            inputValue
          )

          dispatchPassword(inputValue)

          if (lockEntity.isPasswordReady(newPassword)) {
            // dispatchPassword 배치 렌더링 완료 후 confirm이 뜨도록 다음 태스크로 지연
            setTimeout(() => sendPassword(newPassword), 0)
          }
        }}
      >
        <div>
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>

        <div>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </div>

        <div>
          <span>7</span>
          <span>8</span>
          <span>9</span>
        </div>

        <div>
          <span
            className={`!text-lg !bg-red-100 hover:!bg-red-200 ${
              theme === 'dark' ? '!bg-red-900 hover:!bg-red-950' : ''
            } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            DEL
          </span>

          <span>0</span>

          <span
            className={`!text-lg !bg-red-100 hover:!bg-red-200 ${
              theme === 'dark' ? '!bg-red-900 hover:!bg-red-950' : ''
            } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            CLEAR
          </span>
        </div>
      </div>
    </div>
  )
}
