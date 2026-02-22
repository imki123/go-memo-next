import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Lock, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Children, ComponentProps, ReactNode } from 'react'

import { userApi } from '@/apis/userApi'
import { lockFacade } from '@/domain/lock/facade'
import { queryKeys } from '@/lib/queryKeys'
import { localStorageKeys } from '@/utils/localStorageKeys'

import useCommonModal from '../hooks/useCommonModal'
import { useThemeStore } from '../zustand/useThemeStore'

import Avatar from './Avatar'
import { Button } from './ui/button'

type HeaderType = {
  fixed?: boolean
  title?: string | number
  backButton?: boolean
  backButtonSize?: number
  rightItems?: ReactNode[]
  onTitleClick?: () => void
}
export default function Header({
  fixed = true,
  title,
  backButton = true,
  backButtonSize = 20,
  rightItems = [],
  onTitleClick,
}: HeaderType) {
  // 테마 지정
  const { theme, setTheme } = useThemeStore()

  const router = useRouter()

  const { data: isLockedRemote } = lockFacade.query.useLockedStatus()
  const { data: loginData } = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: userApi.checkLogin,
  })

  const { openModal, closeModal, Modal, visible } = useCommonModal()

  const defaultRightItems = [
    <>
      {theme === 'dark' ? (
        <Moon
          size={20}
          onClick={() => {
            setTheme(undefined)
            window.localStorage.removeItem(localStorageKeys.memoTheme)
          }}
          className='cursor-pointer'
        />
      ) : (
        <Sun
          size={20}
          onClick={() => {
            setTheme('dark')
            window.localStorage.setItem(localStorageKeys.memoTheme, 'dark')
          }}
          className='cursor-pointer'
        />
      )}
    </>,
    <Lock
      size={20}
      onClick={() => {
        openModal()
      }}
      className='cursor-pointer'
    />,
    loginData?.token ? (
      <Avatar avatar={loginData} />
    ) : (
      <span>
        <Link
          href='/login'
          key='login'
          className='whitespace-nowrap text-indigo-600 no-underline font-inherit text-sm'
        >
          로그인
        </Link>
      </span>
    ),
  ]

  const allRightItems = rightItems.concat(defaultRightItems)

  const modalButtons: ComponentProps<typeof Button>[] = [
    {
      children: '취소',
      variant: 'secondary',
      onClick: closeModal,
    },
  ]

  if (isLockedRemote) {
    modalButtons.push({
      children: '비밀번호 삭제',
      variant: 'destructive',
      onClick: () => {
        closeModal()
        lockFacade.store.showLockScreen('disable')
      },
    })
  } else {
    modalButtons.push({
      children: '비밀번호 설정',
      onClick: () => {
        closeModal()
        lockFacade.store.showLockScreen('enable')
      },
    })
  }

  return (
    <>
      {fixed && <div className='h-[60px]' />}
      <div
        className={`fixed z-10 top-0 left-1/2 -translate-x-1/2 h-[60px] w-full max-w-[800px] mx-auto ${
          !fixed ? 'relative' : ''
        }`}
      >
        <div
          className={`h-[calc(100%-4px)] flex items-center justify-between gap-5 p-5 font-bold shadow-md bg-white dark:bg-gray-900 ${
            !fixed ? 'relative' : ''
          }`}
        >
          <div
            className='flex-shrink-0 select-none cursor-pointer flex items-center gap-2'
            onClick={() => window.scrollTo(0, 0)}
          >
            {backButton && (
              <ChevronLeft
                size={backButtonSize}
                onClick={router.back}
                className='hover:cursor-pointer'
              />
            )}
            <span className='flex-shrink-0' onClick={() => onTitleClick?.()}>
              {title}
            </span>
          </div>

          <div className='flex flex-1 items-center justify-end gap-4'>
            {Children.toArray(allRightItems?.map((item) => item))}
          </div>
        </div>
      </div>

      <Modal
        visible={visible}
        onClose={closeModal}
        title={
          isLockedRemote
            ? '잠금 비밀번호를 삭제하시겠어요?'
            : '잠금 비밀번호를 설정하시겠어요?'
        }
        buttons={modalButtons}
      />
    </>
  )
}
