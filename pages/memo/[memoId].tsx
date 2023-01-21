import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button } from 'go-storybook'
import { produce } from 'immer'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import { useCallback, useEffect } from 'react'

import { getAllIds, getMemo } from '../../api/memo'
import Header from '../../component/molecule/Header'
import Memo, { MemoModel } from '../../component/molecule/Memo'
import { useGetCheckLogin } from '../../hook/useGetCheckLogin'
import { queryKeys } from '../../queryClient'
import { HEADER_HEIGHT } from '../../styles/GlobalStyle'
import { useMemoHistoryStore, useMemoStore } from '../../zustand'

// Generates static files `/memo/1`, `/memo/2`, ...
export async function getStaticPaths() {
  const allIds = await getAllIds()
  return {
    paths: allIds.map(({ memoId }) => ({
      params: { memoId: memoId.toString() }, // string type required
    })),
    fallback: false, // required fallback: false | true | 'blocking'
  }
}
export async function getStaticProps() {
  return {
    props: {},
  }
}

export default function MemoIdPage() {
  const { data: isLogin } = useGetCheckLogin()
  const router = useRouter()
  const memoId = Number(router.query.memoId)

  // 전체 memos
  const { memos, setMemos } = useMemoStore()

  // 현재 id의 memo
  const memo = memos?.find((item) => item.memoId === memoId)

  // 서버에서 불러온 memo data
  const { data, refetch, isError, isFetched, isFetching } = useQuery(
    queryKeys.getMemo,
    () => getMemo(memoId),
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: false,
    }
  )
  let memoData = memo
  if (data && isLogin) memoData = data

  const {
    memoHistory,
    index,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  const updateMemos = useCallback(
    (memo: MemoModel) => {
      // 스토어의 memos 업데이트
      const result = produce(memos, (draft) => {
        draft?.forEach((item, i) => {
          if (item.memoId === memoId) {
            if (draft?.[i]) {
              draft[i] = memo
            }
          }
        })
        return draft
      })
      setMemos(result)
    },
    [memoId, memos, setMemos]
  )

  // 페이지 벗어나면 히스토리 지우기
  useEffect(() => {
    return () => {
      resetHistory()
    }
  }, [resetHistory])

  // memoId 있으면 서버데이터 불러오기
  useEffect(() => {
    if (memoId && isLogin) refetch()
  }, [isLogin, memoId, refetch])

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

  const title = memoData?.text?.split('\n')[0].slice(0, 50)

  return (
    <>
      <Header title={title} />

      <MemoWrapper>
        {isError ? (
          <div>메모 불러오기 실패 😥</div>
        ) : (
          <>
            <ButtonDiv>
              <Button onClick={clickBack}>뒤로</Button>
              <Button onClick={clickNext}>앞으로</Button>
            </ButtonDiv>
            <Memo
              {...memoData}
              memoId={memoData?.memoId || 0}
              updateMemos={updateMemos}
              fetching={!!isLogin && isFetching}
            />
          </>
        )}
      </MemoWrapper>
    </>
  )
}

const MemoWrapper = styled.div`
  height: calc(100% - ${HEADER_HEIGHT}px);
  padding: 0 15px 15px;
  border-radius: 15px; ;
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
