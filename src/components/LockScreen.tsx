import { AxiosError } from 'axios'
import { Loader2, X } from 'lucide-react'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { toast } from 'sonner'

import { lockFacade } from '@/domains/lock/di'
import { zIndex } from '@/utils/util'
import { useThemeStore } from '@/zustand/useThemeStore'

const MIN_PASSWORD_LENGTH = 4
const MAX_PASSWORD_LENGTH = 4

export function LockScreen() {
  useEffect(() => {
    // NOTE: 패스워드 입력 시 스크롤 방지
    const intervalId = setInterval(() => {
      if (
        document.body.style.overflow === 'hidden' &&
        document.documentElement.style.overflow === 'hidden'
      ) {
        return
      }
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }, 100)
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      clearInterval(intervalId)
    }
  }, [])

  const currentLockScreenType = lockFacade.store.useLockScreenType()
  const { theme } = useThemeStore()
  const { refetch: refetchLogin } = lockFacade.query.useLockedStatus()

  const [isSending, setIsSending] = useState(false)
  const { enableRemote, disableRemote, unlockRemote } =
    lockFacade.query.useLockMutations()

  const sendPassword = useCallback(
    async (currentPassword: string) => {
      if (currentPassword.length < MIN_PASSWORD_LENGTH) {
        return
      }

      if (currentLockScreenType === 'enable') {
        if (window.confirm('비밀번호를 설정하시겠습니까?')) {
          try {
            setIsSending(true)
            await enableRemote.mutateAsync(currentPassword)
            lockFacade.store.setIsLockedLocal(false)
            refetchLogin()
            dispatchPassword('CLEAR')
            lockFacade.store.hideLockScreen()
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
      }

      if (currentLockScreenType === 'disable') {
        if (window.confirm('비밀번호를 삭제하시겠습니까?')) {
          try {
            setIsSending(true)
            await unlockRemote.mutateAsync(currentPassword)
            await disableRemote.mutateAsync()
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
            await refetchLogin()
            lockFacade.store.setIsLockedLocal(false)
            dispatchPassword('CLEAR')
            lockFacade.store.hideLockScreen()
            toast.success('비밀번호 삭제 성공')
            setIsSending(false)
          }
        }
        return
      }

      try {
        setIsSending(true)
        await unlockRemote.mutateAsync(currentPassword)
        lockFacade.store.setIsLockedLocal(false)
        dispatchPassword('CLEAR')
        lockFacade.store.hideLockScreen()
        return
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
        return
      } finally {
        setIsSending(false)
      }
    },
    [
      currentLockScreenType,
      refetchLogin,
      enableRemote,
      disableRemote,
      unlockRemote,
    ]
  )

  const [password, dispatchPassword] = useReducer(
    (state: string, payload: string) => {
      const validValues = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
        'DEL',
        'CLEAR',
        'SEND', // NOTE: 4자리 입력시 자동 전송되기에 SEND 사용하지 않음
      ]

      if (!validValues.includes(payload)) {
        return state
      }

      if (payload === 'DEL') {
        return state.slice(0, -1)
      }

      if (payload === 'SEND') {
        return state
      }

      if (payload === 'CLEAR') {
        return ''
      }

      if ((state + payload).length > MAX_PASSWORD_LENGTH) {
        return state
      }

      return state + payload
    },
    ''
  )

  const asteriskPassword =
    password.length > 0 ? '*'.repeat(password.length) : ''

  const passwordLengthText =
    MAX_PASSWORD_LENGTH === MIN_PASSWORD_LENGTH
      ? `${MIN_PASSWORD_LENGTH}자리`
      : `${MIN_PASSWORD_LENGTH}~${MAX_PASSWORD_LENGTH}자리`

  return (
    <div
      className={`fixed top-[60px] bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] ${
        zIndex.lockScreen
      } p-4 flex flex-col justify-center items-center gap-6 select-none overflow-auto
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}
    >
      {(currentLockScreenType === 'enable' ||
        currentLockScreenType === 'disable') && (
        <X
          className='absolute top-4 right-4 cursor-pointer'
          onClick={() => lockFacade.store.hideLockScreen()}
        />
      )}

      <div className='text-2xl font-bold'>
        {currentLockScreenType === 'enable'
          ? `비밀번호 설정 (${passwordLengthText})`
          : currentLockScreenType === 'disable'
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
        onClick={async (e) => {
          e.stopPropagation()

          if (isSending) {
            return
          }

          const clickedElement = e.target as HTMLSpanElement
          const numberInput = clickedElement?.innerText

          const newPassword = password + numberInput

          if (newPassword.length === MAX_PASSWORD_LENGTH) {
            sendPassword(newPassword)
          }

          dispatchPassword(numberInput)
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
