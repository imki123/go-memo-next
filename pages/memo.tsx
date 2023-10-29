import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button } from 'go-storybook'
import { produce } from 'immer'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getMemo } from '../apis/memo'
import Header from '../components/molecules/Header'
import { Memo, MemoModel } from '../components/molecules/Memo'
import { useGetCheckLogin } from '../hooks/useGetCheckLogin'
import { queryKeys } from '../queryClient'
import { HEADER_HEIGHT } from '../styles/GlobalStyle'
import { useMemoHistoryStore, useMemoStore } from '../zustand'

export default function MemoPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: isLogin } = useGetCheckLogin()
  const router = useRouter()
  const memoId = Number(router.query.memoId || 0)

  // 전체 memos
  const { memos, setMemos } = useMemoStore()
  const [notFound, setNotFound] = useState(false)

  // 현재 id의 memo
  const memo = memos?.find((item) => item.memoId === memoId)

  // 서버에서 불러온 memo data
  const { data, refetch, isError, isFetched, isFetching } = useQuery(
    queryKeys.getMemo,
    () => getMemo(memoId),
    {
      enabled: false,
      staleTime: 0,
      cacheTime: 0,
      onSuccess: (res) => {
        if (memoId > 0) updateMemos(res)
        else setNotFound(true)
      },
    }
  )
  const title = memo?.text?.split('\n')[0].slice(0, 50)

  const {
    memoHistory,
    index,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  // function
  const updateMemos = useCallback(
    (memo: MemoModel) => {
      // 스토어의 memos 업데이트
      const result = produce(memos, (draft) => {
        if (draft?.find((item) => item.memoId === memoId)) {
          draft?.forEach((item, i) => {
            if (item.memoId === memoId) {
              if (draft?.[i]) {
                draft[i] = memo
              }
            }
          })
        } else {
          draft?.push(memo)
        }
        return draft
      })
      setMemos(result)
    },
    [memoId, memos, setMemos]
  )

  const clickBack = () => {
    backHistory()
    if (memoHistory[index - 1] !== undefined) {
      updateMemos({
        memoId,
        text: memoHistory[index - 1],
        editedAt: dayjs().format('YYYY-MM-DD HH:mm'),
      })
    }
  }

  const clickNext = () => {
    nextHistory()
    if (memoHistory[index + 1] !== undefined) {
      updateMemos({
        memoId,
        text: memoHistory[index + 1],
        editedAt: dayjs().format('YYYY-MM-DD HH:mm'),
      })
    }
  }

  // effect
  // 로그인되어있고, memoId가 있으면 데이터 불러오기
  useEffect(() => {
    if (isLogin && memoId > 0) {
      refetch()
    }
  }, [isLogin, memoId, refetch])

  // 페이지 벗어나면 히스토리 지우기
  useEffect(() => {
    return () => {
      resetHistory()
    }
  }, [resetHistory])

  // 히스토리에 첫 데이터 저장
  useEffect(() => {
    if (index === -1 && memoId) {
      if (isFetched) {
        pushHistory(data?.text || '')
      } else {
        pushHistory(memo?.text || '')
      }
    }
  }, [data?.text, index, isFetched, memo?.text, memoId, pushHistory])

  return (
    <>
      <Header
        title={title}
        onTitleClick={() => {
          textareaRef.current?.scrollTo(0, 0)
        }}
      />

      <MemoWrapper>
        {isError || (isLogin && notFound) ? (
          <StyledCenter>메모 불러오기 실패 😥</StyledCenter>
        ) : (
          <>
            <ButtonDiv>
              <Button onClick={clickBack}>뒤로</Button>
              <Button onClick={clickNext}>앞으로</Button>
            </ButtonDiv>
            <Memo
              {...memo}
              memoId={memoId || 0}
              updateMemos={updateMemos}
              fetching={!!isLogin && isFetching}
              ref={textareaRef}
            />
          </>
        )}
      </MemoWrapper>
    </>
  )
}

const MemoWrapper = styled.div`
  height: calc(100vh - ${HEADER_HEIGHT}px);
  padding: 0 15px 15px;
  border-radius: 15px;
`
const StyledCenter = styled.div`
  text-align: center;
`

const ButtonDiv = styled.div`
  position: fixed;
  height: 100px;
  bottom: 10px;
  right: 20px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  button {
    font-size: 10px;
    width: 40px;
    height: 30px;
    padding: 0;
    background: ${OpenColor.yellow[7]};
  }
`
