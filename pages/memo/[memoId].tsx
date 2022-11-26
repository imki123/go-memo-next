import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getMemo } from '../../api/memo'
import Header from '../../component/Header'
import Memo, { MemoModel } from '../../component/Memo'
import { queryKeys } from '../../queryClient'

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

export default function MemoIdPage({ memo }: { memo: MemoModel }) {
  const router = useRouter()
  const memoId = Number(router.query.memoId)

  const { data, isError } = useQuery(queryKeys.getMemo, () => getMemo(memoId), {
    staleTime: 0,
    cacheTime: 0,
  })
  const [memoData, setMemoData] = useState(memo)

  useEffect(() => {
    setMemoData(() => data || memo)
  }, [data, memo])

  const title = memoData?.text?.split('\n')[0].slice(0, 50)

  return (
    <>
      <Header title={title} />
      <MemoWrapper>
        {isError ? (
          <div>메모 불러오기 실패</div>
        ) : (
          memoData && <Memo {...memoData} setMemoData={setMemoData} />
        )}
      </MemoWrapper>
    </>
  )
}

const MemoWrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 0 15px 15px;
  border-radius: 15px; ;
`
