import Image from 'next/image'
import { checkLogin, loginResponse, logout } from '../api/user'
import styled from '@emotion/styled'
import useModal from '../hook/useModal'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryClient, queryKeys } from '../queryClient'
import OpenColor from 'open-color'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: loginResponse
  onClick?: () => void
}) => {
  const [defaultImage, setDefaultImage] = useState(false)
  const { openModal, closeModal, Modal, setTitle, setButtons } = useModal()
  const { refetch } = useQuery(queryKeys.checkLogin, checkLogin, {
    enabled: false,
  })

  const click =
    onClick ||
    (() => {
      openModal()
      setTitle('로그아웃 하시겠습니까?')
      setButtons([
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
            // 로그아웃
            logout()
              .then(() => {
                // checkLogin
                refetch()
                // 메모 데이터 초기화
                queryClient.setQueryData(queryKeys.getAllMemo, undefined)
              })
              .catch(() => {
                closeModal()
                setTitle('로그아웃에 실패했습니다. 😥')
                setButtons([
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
    <>
      <AvatarWrapper onClick={click}>
        <AvatarSpan>{avatar.name}</AvatarSpan>
        {defaultImage ? (
          <DefaultImage />
        ) : (
          <Image
            src={avatar.picture || ''}
            width='30'
            height='30'
            alt='avatar'
            onError={() => setDefaultImage(true)}
          />
        )}
      </AvatarWrapper>
      <Modal />
    </>
  )
}

export default Avatar

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    border-radius: 50%;
  }
`
const AvatarSpan = styled.span`
  font-size: 12px;
  margin-right: 8px;
`
const DefaultImage = styled.span`
  display: inline-block;
  height: 30px;
  width: 30px;
  background: ${OpenColor.green[3]};
  border-radius: 50%;
`
