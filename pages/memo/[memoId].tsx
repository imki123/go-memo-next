import Memo, { MemoModel } from '../../molecule/Memo'
import { useEffect, useState } from 'react'

import Header from '../../molecule/Header'
import { getMemo } from '../../api/memo'
import { headerHeight } from '../../styles/GlobalStyle'
import produce from 'immer'
import { queryKeys } from '../../queryClient'
import styled from '@emotion/styled'
import { useGetCheckLogin } from '../../hook/useGetCheckLogin'
import { useMemoStore } from '../../util/zustand'
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
  const router = useRouter()
  const memoId = Number(router.query.memoId)

  const { memos, setMemos } = useMemoStore()
  const { data: isLogin } = useGetCheckLogin()
  const { data, refetch, isError } = useQuery(
    queryKeys.getMemo,
    () => getMemo(memoId),
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: false,
    }
  )
  const [memoData, setMemoData] = useState<MemoModel>()

  const updateMemoData = (memo: MemoModel) => {
    if (isLogin) {
      setMemoData((state) => ({
        ...state,
        ...memo,
      }))
    } else {
      // 스토어의 더미데이터 업데이트
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
    }
  }

  // 로그인 되어있으면 메모 불러오고, 안되어있으면 더미메모 수정
  useEffect(() => {
    if (isLogin) {
      refetch()
    } else {
      // 더미메모
      setMemoData(memos?.find((item) => item.memoId === memoId))
    }
  }, [isLogin, memoId, memos, refetch])

  useEffect(() => {
    if (data) setMemoData(data)
  }, [data])

  const title = memoData?.text?.split('\n')[0].slice(0, 50)

  return (
    <>
      <Header title={title} />
      <MemoWrapper>
        {isError ? (
          <div>메모 불러오기 실패 😥</div>
        ) : (
          memoData && <Memo {...memoData} setMemoData={updateMemoData} />
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
