import Memo, { MemoModel } from '../../component/molecule/Memo'
import { useCallback, useEffect, useState } from 'react'
import { useMemoHistoryStore, useMemoStore } from '../../zustand'

import Button from '../../component/atom/Button'
import Header from '../../component/molecule/Header'
import OpenColor from 'open-color'
import dayjs from 'dayjs'
import { getMemo } from '../../api/memo'
import { headerHeight } from '../../styles/GlobalStyle'
import produce from 'immer'
import { queryKeys } from '../../queryClient'
import styled from '@emotion/styled'
import { useGetCheckLogin } from '../../hook/useGetCheckLogin'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

/* // This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const memos = await getAllMemo()

  // Get the paths we want to pre-render based on posts
  const paths = memos.map((memo) => ({
    params: { memoId: memo.memoId },
  }))
  console.log('>>> getStaticPaths:', paths)

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export async function getStaticProps({
  params,
}: {
  params: { memoId: number }
}) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const memo = await getMemo(params.memoId)
  console.log('>>> getStaticProps:', params.memoId, memo)

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      memo,
    },
  }
} */

export default function MemoIdPage() {
  const { data: isLogin } = useGetCheckLogin()
  const router = useRouter()
  const memoId = Number(router.query.memoId)

  // 전체 memos
  const { memos, setMemos } = useMemoStore()

  // 현재 id의 memo
  const memo = memos?.find((item) => item.memoId === memoId)

  // 서버에서 불러온 memo data
  const { data, refetch, isError, isFetched } = useQuery(
    queryKeys.getMemo,
    () => getMemo(memoId),
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: false,
    }
  )
  const [currentMemo, setCurrentMemo] = useState(memo)

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
        let index = 0
        draft?.forEach((item, i) => {
          if (item.memoId === memoId) {
            index = i
          }
        })
        if (draft?.[index]) {
          draft[index] = memo
        }
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
        setCurrentMemo(data)
        console.info('pushHistory:', data?.text || '')
        pushHistory(data?.text || '')
      } else {
        console.info('pushHistory:', memo?.text || '')
        pushHistory(memo?.text || '')
      }
    }
  }, [data, index, isError, isFetched, memo?.text, memoId, pushHistory])

  // 메모가 변경되면 currentMemo에 저장
  useEffect(() => {
    setCurrentMemo(memo)
  }, [memo])

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

  const title = currentMemo?.text?.split('\n')[0].slice(0, 50)

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
            {currentMemo && <Memo {...currentMemo} updateMemos={updateMemos} />}
          </>
        )}
      </MemoWrapper>
    </>
  )
}

const MemoWrapper = styled.div`
  height: calc(100% - ${headerHeight}px);
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
