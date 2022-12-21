import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { postMemo } from '../api/memo'
import { checkLogin } from '../api/user'
import Button from '../component/atom/Button'
import MemoGrid from '../component/layout/MemoGrid'
import Header from '../component/molecule/Header'
import { useGetAllMemo } from '../hook/useGetAllMemo'
import useModal from '../hook/useModal'
import { queryKeys } from '../queryClient'
import { useMemoStore } from '../zustand'

export default function HomePage() {
  const { memos, setMemos } = useMemoStore()
  const { data: isLogin } = useQuery(queryKeys.checkLogin, checkLogin)
  const { data, refetch, isLoading } = useGetAllMemo({
    staleTime: 0,
    cacheTime: 0,
  })
  const { openModal, Modal, setTitle } = useModal()
  const [noSession, setNoSession] = useState(false)
  const sortedData = useMemo(
    () =>
      [...(memos || [])]?.sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [memos]
  )

  useDeepCompareEffect(() => {
    if (data && isLogin) {
      setMemos(data)
    }
  }, [data, setMemos, isLogin])

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
                setTitle(
                  <>
                    메모 추가에 실패했습니다. 😥
                    {noSession ? (
                      <>
                        <br />
                        로그인이 필요합니다.
                      </>
                    ) : null}
                  </>
                )
              })
          }}
        >
          메모추가
        </Button>
      </ButtonDiv>
      {isLoading ? (
        <LoadingDiv>로딩중...</LoadingDiv>
      ) : (
        <MemoGrid memoData={sortedData} />
      )}
      <Modal />
    </>
  )
}

const ButtonDiv = styled.div`
  text-align: center;
  margin: 20px;
`

const LoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`
