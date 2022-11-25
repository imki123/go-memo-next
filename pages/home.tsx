import React, { useEffect } from 'react'
import Link from 'next/link'
import Header from '../component/Header'
import MemoGrid from '../component/MemoGrid'
import { dummyMemo } from '../dummy/dummyMemo'
import { checkLogin } from '../api/user'

export default function HomePage() {
  const rightItems = [
    <Link href='/login' key='login'>
      로그인
    </Link>,
  ]

  useEffect(() => {
    checkLogin().then((res) => {
      console.log('>>> checkLogin', res)
    })
  }, [])

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
