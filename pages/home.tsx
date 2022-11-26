import React, { useState } from 'react'
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
import useModal, { ModalButtonModel } from './../hook/useModal'

export default function HomePage() {
  const { openModal, closeModal, Modal } = useModal()
  const [modalTitle, setModalTitle] = useState('')
  const [modalButtons, setModalButtons] = useState<ModalButtonModel[]>()
  const { data: isLogin, refetch } = useQuery(
    queryKeys.checkLogin,
    checkLogin,
    {
      staleTime: 0,
    }
  )
  const clickAvatar = () => {
    openModal()
    setModalTitle('로그아웃 하시겠습니까?')
    setModalButtons([
      {
        text: '취소',
        onClick: () => {
          closeModal()
        },
      },
      {
        text: '확인',
        onClick: () => {
          closeModal()
          logout()
            .then(() => {
              refetch()
            })
            .catch(() => {
              closeModal()
              setModalTitle('로그아웃에 실패했습니다. 😥')
              setModalButtons([
                {
                  text: '확인',
                  onClick: () => {
                    closeModal()
                  },
                },
              ])
            })
        },
      },
    ])
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
      <Modal title={modalTitle} buttons={modalButtons} />
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
