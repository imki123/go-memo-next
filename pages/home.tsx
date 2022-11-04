import Link from 'next/link'
import Header from '../component/Header'
import MemoGrid from '../component/MemoGrid'
import { dummyMemo } from '../dummy/dummyMemo'

export default function HomePage() {
  const rightItems = [
    // eslint-disable-next-line react/jsx-key
    <Link href='/login'>로그인</Link>,
  ]
  return (
    <>
      <Header
        title='고영이 메모장 🐈'
        backButton={false}
        rightItems={rightItems}
      />
      <MemoGrid memoData={dummyMemo} />
    </>
  )
}
