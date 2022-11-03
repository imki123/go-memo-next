import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import Header from '../../component/Header'
import Memo from '../../component/Memo'
import { dummyMemo } from '../../dummy/dummyMemo'

export default function MemoIdPage() {
  const router = useRouter()
  const {
    query: { memoId },
  } = router

  const memoData = dummyMemo.find((item) => item.memoId === Number(memoId))
  const title = memoData?.text?.split('\n')[0].slice(0, 50)

  return (
    <>
      <Header title={title} />
      <MemoWrapper>{memoData && <Memo {...memoData} />}</MemoWrapper>
    </>
  )
}

const MemoWrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 0 10px 10px;
  border-radius: 10px; ;
`
