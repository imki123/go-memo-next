import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { memoApi } from '../src/apis/memoApi'
import { userApi } from '../src/apis/userApi'
import FloatingButtonsLayout from '../src/components/FloatingButtonsLayout'
import Header from '../src/components/Header'
import { MemoGrid } from '../src/components/MemoGrid'
import ReloadButton from '../src/components/ReloadButton'
import Splash from '../src/components/Splash'
import { Input } from '../src/components/ui/input'
import useModal from '../src/hooks/useModal'
import { useApiQuery } from '../src/lib/queryUtils'
import { useAllMemosStore } from '../src/zustand/useAllMemosStore'
import { useSplashStore } from '../src/zustand/useSplashStore'

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}

export default function IndexPage() {
  const router = useRouter()

  const { allMemos, setAllMemos } = useAllMemosStore()
  const { visible: splashVisible, setVisible: setSplashVisible } =
    useSplashStore()
  const { openModal, closeModal, Modal, visible } = useModal()

  const { data: isLogin } = useApiQuery({ queryFn: userApi.checkLogin })
  const {
    data: allMemosData,
    refetch,
    isLoading,
    isFetching,
    isFetched,
  } = useApiQuery({
    queryFn: memoApi.getAllMemo,
    options: {
      enabled: !!isLogin,
    },
  })

  const initialTimeoutId = useRef<NodeJS.Timeout>()

  const [splashOpened, setSplashOpened] = useState(true)
  const [errorTitle, setErrorTitle] = useState<string>()

  async function addMemo() {
    try {
      const response = await memoApi.postMemo()
      router.push(`/memo?memoId=${response.memoId}`)
      await refetch() // refetch 완료 후 토스트 표시
      toast.success('메모 추가 성공')
    } catch (err) {
      console.error(err)
      const error = err as AxiosError
      let title
      if (error.response?.data === 'no session') {
        title = '로그인이 필요합니다. 😥'
      } else {
        title = '메모 추가에 실패했습니다. 😥'
      }
      setErrorTitle(title)
      openModal()
    }
  }

  useEffect(() => {
    // NOTE: 서버에서 받아온 메모로 업데이트
    if (isLogin && allMemosData && isFetched) {
      setAllMemos(allMemosData || [])
    }
  }, [isLogin, allMemosData, setAllMemos, isFetched])

  useEffect(() => {
    // NOTE: 스플래시 노출
    if (splashVisible === undefined) {
      setSplashVisible(true)
      initialTimeoutId.current = setTimeout(
        () => setSplashVisible(false),
        1 * 1000
      )
    }
    if (splashVisible === false) {
      setTimeout(() => setSplashOpened(false), 300)
    }
  }, [splashVisible, setSplashVisible])

  useEffect(() => {
    // NOTE: 언마운트시 타임아웃 제거
    return () => {
      clearTimeout(initialTimeoutId.current)
    }
  }, [])

  const sortedMemos = useMemo(
    () =>
      [...(allMemos || [])].sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [allMemos]
  )

  const [searchValue, setSearchValue] = useState('')
  const filteredMemos = sortedMemos.filter((memo) => {
    return memo.text?.includes(searchValue)
  })

  if (splashVisible === undefined) {
    return null
  }

  return (
    <>
      {splashOpened && <Splash visible={splashVisible} />}

      <Header title='고영이 메모장🐈' backButton={false} />

      <div className='flex justify-between items-center mx-5 gap-5 my-4'>
        <Input
          placeholder='메모 검색'
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          className='w-full max-w-[200px] flex-shrink'
        />

        <Button onClick={addMemo} size='sm'>
          메모추가
        </Button>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center h-[200px]'>
          <div>로딩 중...</div>
          <div>서버 재시작 중에는 1분 정도 소요될 수 있습니다.</div>
        </div>
      ) : (
        <MemoGrid
          memoData={filteredMemos.map((memo) => ({ memoId: memo.memoId }))}
        />
      )}

      <FloatingButtonsLayout>
        <ReloadButton
          isReloading={isFetching}
          onClick={() => {
            if (!isFetching)
              refetch().then(() => toast.success('새로고침 성공'))
          }}
        />
      </FloatingButtonsLayout>

      <Modal visible={visible} title={errorTitle} onClose={closeModal} />
    </>
  )
}
