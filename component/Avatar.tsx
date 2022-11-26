import Image from 'next/image'
import { checkLogin, loginResponse, logout } from '../api/user'
import styled from '@emotion/styled'
import useModal, { ModalButtonModel } from '../hook/useModal'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryClient'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: loginResponse
  onClick?: () => void
}) => {
  const { openModal, closeModal, Modal } = useModal()
  const [modalTitle, setModalTitle] = useState('')
  const [modalButtons, setModalButtons] = useState<ModalButtonModel[]>()
  const { refetch } = useQuery(queryKeys.checkLogin, checkLogin, {
    enabled: false,
  })

  const click =
    onClick ||
    (() => {
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
    })

  return (
    <AvatarWrapper onClick={click}>
      <AvatarSpan>{avatar.name}</AvatarSpan>
      <Image src={avatar.picture || ''} width='30' height='30' alt='avatar' />
      <Modal title={modalTitle} buttons={modalButtons} />
    </AvatarWrapper>
  )
}

export default Avatar

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    border-radius: 50%;
  }
`
const AvatarSpan = styled.span`
  font-size: 12px;
  margin-right: 8px;
`
