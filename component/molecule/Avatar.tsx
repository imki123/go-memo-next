import { loginResponse, logout } from '../../api/user'
import { queryClient, queryKeys } from '../../queryClient'

import Image from 'next/image'
import OpenColor from 'open-color'
import { addSnackBar } from '../../util/util'
import { dummyMemos } from '../../api/dummyMemos'
import styled from '@emotion/styled'
import { useGetCheckLogin } from '../../hook/useGetCheckLogin'
import { useMemoStore } from '../../zustand'
import useModal from '../../hook/useModal'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: loginResponse
  onClick?: () => void
}) => {
  const [defaultImage, setDefaultImage] = useState(false)
  const { openModal, closeModal, Modal, setTitle, setButtons } = useModal()
  const { setMemos } = useMemoStore()
  const { refetch } = useGetCheckLogin({
    enabled: false,
  })
  const router = useRouter()

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
                addSnackBar('로그아웃 성공')
                refetch() // checkLogin
                queryClient.setQueryData(queryKeys.getAllMemo, null)
                setMemos(dummyMemos)
                router.replace('/home')
              })
              .catch((err) => {
                addSnackBar(`로그아웃 실패😥<br/>${JSON.stringify(err)}`)
              })
          },
        },
      ])
    })

  return (
    <>
      <AvatarWrapper>
        {defaultImage ? (
          <DefaultImage onClick={click} />
        ) : (
          <Image
            src={avatar.picture || ''}
            width='30'
            height='30'
            alt='avatar'
            onError={() => setDefaultImage(true)}
            onClick={click}
          />
        )}
        <AvatarSpan>{avatar.name}</AvatarSpan>
      </AvatarWrapper>
      <Modal />
    </>
  )
}

export default Avatar

const AvatarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  img {
    cursor: pointer;
    border-radius: 50%;
  }
`
const AvatarSpan = styled.span`
  position: absolute;
  top: 30px;
  right: 0;
  display: inline-block;
  font-size: 10px;
  text-align: right;
`
const DefaultImage = styled.span`
  display: inline-block;
  height: 30px;
  width: 30px;
  background: ${OpenColor.green[3]};
  border-radius: 50%;
`