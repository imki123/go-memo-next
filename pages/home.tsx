import React from 'react'
import Link from 'next/link'
import Header from '../component/Header'
import MemoGrid from '../component/MemoGrid'
import { dummyMemo } from '../dummy/dummyMemo'
import { checkLogin, logout } from '../api/user'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryClient'
import Avatar from '../component/Avatar'
import styled from '@emotion/styled'
import OpenColor from 'open-color'

export default function HomePage() {
  const { data: isLogin, refetch } = useQuery(queryKeys.checkLogin, checkLogin)
  const clickAvatar = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout()
        .then(() => {
          refetch()
        })
        .catch(() => {
          window.alert('로그아웃에 실패했습니다. 😥')
        })
    }
  }
  const rightItems = [
    isLogin ? (
      <Avatar avatar={isLogin} onClick={clickAvatar} />
    ) : (
      <LinkWrapper>
        <Link href='/login' key='login'>
          로그인
        </Link>
      </LinkWrapper>
    ),
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

const LinkWrapper = styled.span`
  a {
    color: ${OpenColor.indigo[6]};
    text-decoration: none;
    font: inherit;
    font-size: 14px;
  }
`
