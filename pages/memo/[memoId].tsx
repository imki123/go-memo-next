import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import Header from '../../component/Header'
import Memo from '../../component/Memo'
import { dummyMemo } from '../../component/MemoGrid'

export default function MemoIdPage() {
  const router = useRouter()
  const {
    query: { memoId },
  } = router

  const memoData = dummyMemo.find((item) => item.memoId === Number(memoId))

  return (
    <>
      <Header title={memoId as string} />
      <MemoWrapper>{memoData && <Memo {...memoData} />}</MemoWrapper>
    </>
  )
}

const MemoWrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 0 20px 20px;
  border-radius: 20px; ;
`
