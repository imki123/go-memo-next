import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { Button } from 'go-storybook'
import { useEffect, useMemo, useRef, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { postMemo } from '../apis/memo'
import { checkLogin } from '../apis/user'
import Loading from '../components/atoms/Loading'
import Reload from '../components/atoms/Reload'
import FloatingButtonsLayout from '../components/layouts/FloatingButtonsLayout'
import MemoGrid from '../components/layouts/MemoGrid'
import Splash from '../components/layouts/Splash'
import Header from '../components/molecules/Header'
import { useGetAllMemo } from '../hooks/useGetAllMemo'
import useModal from '../hooks/useModal'
import { queryKeys } from '../queryClient'
import { addSnackBar } from '../utils/util'
import { useMemoStore, useSplashStore, useThemeStore } from '../zustand'

export default function IndexPage() {
  const { memos, setMemos } = useMemoStore()
  const { theme } = useThemeStore()
  const { initial, set: setInitial } = useSplashStore()
  const initialTimeoutId = useRef<NodeJS.Timeout>()
  const [splashOpened, setSplashOpened] = useState(true)

  const sortedData = useMemo(
    () =>
      [...(memos || [])]?.sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [memos]
  )

  // hook
  const { openModal, Modal, setTitle } = useModal()

  // query
  const { data: isLogin } = useQuery(queryKeys.checkLogin, checkLogin)
  const { data, refetch, isLoading, isFetching } = useGetAllMemo()

  // function
  const addMemo = async () => {
    postMemo()
      .then(() => {
        refetch()
        addSnackBar('메모 추가 성공')
      })
      .catch((err: AxiosError) => {
        console.error(err)
        let title
        if (err.response?.data === 'no session') {
          title = '로그인이 필요합니다. 😥'
        } else {
          title = '메모 추가에 실패했습니다. 😥'
        }
        openModal()
        setTitle(title)
      })
  }

  // effect
  useDeepCompareEffect(() => {
    if (data && isLogin) {
      setMemos(data)
    }
  }, [data, setMemos, isLogin])

  // 처음 접근할 경우 스플래시 노출, 2초 후 숨기기
  useEffect(() => {
    if (initial === undefined) {
      setInitial(true)
      initialTimeoutId.current = setTimeout(() => setInitial(false), 1000 * 2) // 2초 후 스플래시 숨기기
    }
    if (initial === false) {
      setTimeout(() => setSplashOpened(false), 300) // 스플래시 숨기고 0.3초 후 돔에서 제거
    }
  }, [initial, setInitial])

  // 언마운트시 타임아웃 제거
  useEffect(() => {
    return () => {
      clearTimeout(initialTimeoutId.current)
    }
  }, [])

  if (initial === undefined) return null
  return (
    <>
      {splashOpened && <Splash visible={initial} theme={theme} />}

      <Header title='고영이 메모장🐈' backButton={false} />
      <ButtonDiv>
        <Button onClick={addMemo}>메모추가</Button>
      </ButtonDiv>

      {isLoading ? <Loading /> : <MemoGrid memoData={sortedData} />}

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
  text-align: center;
  margin: 20px;
`

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}
