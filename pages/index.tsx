import styled from '@emotion/styled'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { Button } from 'go-storybook'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import { memoApi } from '../apis/memoApi'
import { userApi } from '../apis/userApi'
import Loading from '../components/atoms/Loading'
import Reload from '../components/atoms/Reload'
import FloatingButtonsLayout from '../components/layouts/FloatingButtonsLayout'
import { MemoGrid } from '../components/layouts/MemoGrid'
import Splash from '../components/layouts/Splash'
import Header from '../components/molecules/Header'
import { Input } from '../components/ui/input'
import useModal from '../hooks/useModal'
import { useApiQuery } from '../lib/queryUtils'
import { addSnackBar } from '../utils/util'
import { useAllMemosStore } from '../zustand/useAllMemosStore'
import { useSplashStore } from '../zustand/useSplashStore'

export default function IndexPage() {
  const router = useRouter()

  const { allMemos, setAllMemos } = useAllMemosStore()
  const { initial, setState: setInitial } = useSplashStore()
  const initialTimeoutId = useRef<NodeJS.Timeout>()
  const [splashOpened, setSplashOpened] = useState(true)

  // hook
  const { openModal, Modal, setTitle } = useModal()

  // query
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

  // function
  async function addMemo() {
    try {
      const response = await memoApi.postMemo()
      router.push(`/memo?memoId=${response.memoId}`)
      await refetch() // refetch 완료 후 스낵바 표시
      addSnackBar('메모 추가 성공')
    } catch (err) {
      console.error(err)
      const error = err as AxiosError
      let title
      if (error.response?.data === 'no session') {
        title = '로그인이 필요합니다. 😥'
      } else {
        title = '메모 추가에 실패했습니다. 😥'
      }
      openModal()
      setTitle(title)
    }
  }

  useEffect(() => {
    // NOTE: 서버에서 받아온 메모로 업데이트
    if (isLogin && allMemosData && isFetched) {
      setAllMemos(allMemosData)
    }
  }, [isLogin, allMemosData, setAllMemos, isFetched])

  useEffect(() => {
    // 스플래시 노출
    if (initial === undefined) {
      setInitial(true)
      // 페이지 열리고 1초 후 스플래시 fadeout
      initialTimeoutId.current = setTimeout(() => setInitial(false), 1 * 1000)
    }
    if (initial === false) {
      // 스플래시 fadeout되고 0.3초 후 제거
      setTimeout(() => setSplashOpened(false), 300)
    }
  }, [initial, setInitial])

  // 언마운트시 타임아웃 제거
  useEffect(() => {
    return () => {
      clearTimeout(initialTimeoutId.current)
    }
  }, [])

  const sortedMemos = useMemo(
    () =>
      [...(allMemos || [])]?.sort((a, b) => {
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

  if (initial === undefined) {
    return null
  }

  return (
    <>
      {splashOpened && <Splash visible={initial} />}

      <Header title='고영이 메모장🐈' backButton={false} />

      <ButtonDiv>
        <Input
          placeholder='메모 검색'
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          className='w-full max-w-[200px] flex-shrink'
        />

        <Button onClick={addMemo}>메모추가</Button>
      </ButtonDiv>

      {isLoading ? (
        <Loading />
      ) : (
        <MemoGrid
          memoData={filteredMemos.map((memo) => ({ memoId: memo.memoId }))}
        />
      )}

      <FloatingButtonsLayout>
        <Reload
          isReloading={isFetching}
          onClick={() => {
            if (!isFetching) refetch().then(() => addSnackBar('새로고침 성공'))
          }}
        />
      </FloatingButtonsLayout>

      <Modal />
    </>
  )
}

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  gap: 20px;
`

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}
