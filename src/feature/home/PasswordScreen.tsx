import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { useEffect, useReducer } from 'react'
import { toast } from 'sonner'

import { userApi } from '@/apis/userApi'
import { zIndex } from '@/utils/util'
import { usePasswordScreenStore } from '@/zustand/usePasswordScreenStore'
import { useThemeStore } from '@/zustand/useThemeStore'

const MIN_PASSWORD_LENGTH = 4
const MAX_PASSWORD_LENGTH = 6

export function PasswordScreen() {
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

  const { closePasswordScreen, passwordScreenType } = usePasswordScreenStore()
  const { theme } = useThemeStore()

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
        'SEND',
        'CLEAR',
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

  return (
    <div
      className={`fixed top-[60px] bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] ${
        zIndex.passwordScreen
      } p-4 flex flex-col justify-center items-center gap-6 select-none overflow-auto
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}
    >
      <X
        className='absolute top-4 right-4 cursor-pointer'
        onClick={closePasswordScreen}
      />

      <div className='text-2xl font-bold'>
        {passwordScreenType === 'setup'
          ? '비밀번호 설정 (4~6자리)'
          : '메모 잠금 해제 (4~6자리)'}
      </div>

      <div className='text-3xl font-bold py-2 px-4 h-[60px]'>
        {asteriskPassword}
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

          const clickedElement = e.target as HTMLSpanElement
          const value = clickedElement?.innerText

          if (value === 'SEND') {
            if (password.length < MIN_PASSWORD_LENGTH) {
              return
            }

            if (passwordScreenType === 'setup') {
              if (window.confirm('비밀번호를 설정하시겠습니까?')) {
                try {
                  await userApi.setLock(password)
                  dispatchPassword('CLEAR')
                  closePasswordScreen()
                } catch (err) {
                  const error = err as AxiosError
                  console.error(err)
                  toast.error(`비밀번호 설정에 실패했습니다.\n${error.message}`)
                  return
                }
              }
              return
            }

            try {
              // NOTE: 잠금 해제
              await userApi.unlock(password)
              dispatchPassword('CLEAR')
              closePasswordScreen()
              return
            } catch (err) {
              const error = err as AxiosError
              console.error(err)
              toast.error(`잠금 해제에 실패했습니다.\n${error.message}`)
              return
            }
          }

          dispatchPassword(value)
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
            }`}
          >
            DEL
          </span>
          <span>0</span>
          <span
            className={`!text-lg !bg-blue-100 hover:!bg-blue-200 ${
              theme === 'dark' ? '!bg-blue-900 hover:!bg-blue-950' : ''
            }`}
          >
            SEND
          </span>
        </div>
      </div>
    </div>
  )
}
