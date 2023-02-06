import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { Button } from 'go-storybook'
import { useMemo } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { postMemo } from '../api/memo'
import { checkLogin } from '../api/user'
import Loading from '../component/atom/Loading'
import Reload from '../component/atom/Reload'
import FloatingButtonsLayout from '../component/layout/FloatingButtonsLayout'
import MemoGrid from '../component/layout/MemoGrid'
import Header from '../component/molecule/Header'
import { useGetAllMemo } from '../hook/useGetAllMemo'
import useModal from '../hook/useModal'
import { queryKeys } from '../queryClient'
import { addSnackBar } from '../util/util'
import { useMemoStore } from '../zustand'

export default function HomePage() {
  const { memos, setMemos } = useMemoStore()
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

  return (
    <>
      <Header title='고영이 메모장 🐈' backButton={false} />
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
