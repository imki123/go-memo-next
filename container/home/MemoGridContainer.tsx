import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { postMemo } from '../../api/memo'
import { checkLogin } from '../../api/user'
import Button from '../../component/atom/Button'
import Loading from '../../component/atom/Loading'
import Reload from '../../component/atom/Reload'
import FloatingButtonsLayout from '../../component/layout/FloatingButtonsLayout'
import MemoGrid from '../../component/layout/MemoGrid'
import { useGetAllMemo } from '../../hook/useGetAllMemo'
import useModal from '../../hook/useModal'
import { queryKeys } from '../../queryClient'
import { addSnackBar } from '../../util/util'
import { useMemoStore } from '../../zustand'

/**
 * MemoGridContainer
 * @params
 */

const MemoGridContainer = () => {
  // store
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

  // state
  const [noSession, setNoSession] = useState(false)

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
  }

  // effect
  useDeepCompareEffect(() => {
    if (data && isLogin) {
      setMemos(data)
    }
  }, [data, setMemos, isLogin])

  return (
    <>
      <ButtonDiv>
        <Button onClick={addMemo}>메모추가</Button>
      </ButtonDiv>

      {isLoading ? <Loading /> : <MemoGrid memoData={sortedData} />}

      <FloatingButtonsLayout>
        <Button
          type={'Circle'}
          onClick={() => {
            if (!isFetching) refetch().then(() => addSnackBar('새로고침 성공'))
          }}
        >
          <Reload isReloading={isFetching} />
        </Button>
      </FloatingButtonsLayout>

      <Modal />
    </>
  )
}

export default React.memo(MemoGridContainer)

const ButtonDiv = styled.div`
  text-align: center;
  margin: 20px;
`
