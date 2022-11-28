import { queryClient, queryKeys } from '../queryClient'

import { AxiosError } from 'axios'
import Button from '../component/Button'
import Header from '../component/Header'
import MemoGrid from '../component/MemoGrid'
import { checkLogin } from '../api/user'
import { postMemo } from '../api/memo'
import styled from '@emotion/styled'
import { useGetAllMemo } from '../hook/useGetAllMemo'
import useModal from '../hook/useModal'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useStore } from '../util/zustand'

export default function HomePage() {
  const { memos, setMemos } = useStore()
  const { data: isLogin } = useQuery(queryKeys.checkLogin, checkLogin)
  const { data, refetch, isError, isLoading, isFetching } = useGetAllMemo({
    staleTime: 0,
    cacheTime: 0,
  })
  const { openModal, Modal } = useModal()
  const [noSession, setNoSession] = useState(false)

  // 로그인 되어있으면 memo 불러오고, 안되어있으면 스토어에 demmyMemo 저장
  if (isError && isLogin) {
    queryClient.setQueryData([queryKeys.getAllMemo], [])
  }

  return (
    <>
      <Header title='고영이 메모장 🐈' backButton={false} />
      <ButtonDiv>
        <Button
          onClick={async () => {
            postMemo()
              .then(() => {
                refetch()
              })
              .catch((err: AxiosError) => {
                console.error(err)
                if (err.response?.data === 'no session') {
                  setNoSession(true)
                } else {
                  setNoSession(false)
                }
                openModal()
              })
          }}
        >
          메모추가
        </Button>
      </ButtonDiv>
      {isLoading || isFetching ? (
        <LoadingDiv>로딩중...</LoadingDiv>
      ) : (
        <MemoGrid memoData={isLogin ? data : memos} />
      )}
      <Modal
        title={
          <>
            메모 추가에 실패했습니다. 😥
            {noSession ? (
              <>
                <br />
                로그인이 필요합니다.
              </>
            ) : null}
          </>
        }
      />
    </>
  )
}

const ButtonDiv = styled.div`
  text-align: center;
  margin: 10px;
`

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`
