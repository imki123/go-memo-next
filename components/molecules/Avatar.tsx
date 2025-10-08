import styled from '@emotion/styled'
import Image from 'next/image'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import { useState } from 'react'

import { dummyMemos } from '../../apis/dummyMemos'
import { memoApi } from '../../apis/memoApi'
import { LoginResponseType, userApi } from '../../apis/userApi'
import useModal from '../../hooks/useModal'
import { useApiQuery, useInvalidation } from '../../lib/queryUtils'
import { routes } from '../../pages'
import { addSnackBar } from '../../utils/util'
import { useAllMemosStore } from '../../zustand/useAllMemosStore'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: LoginResponseType
  onClick?: () => void
}) => {
  const router = useRouter()

  const { openModal, closeModal, Modal, visible } = useModal()
  const { setAllMemos } = useAllMemosStore()
  const { invalidateQuery } = useInvalidation()

  const { refetch } = useApiQuery({
    queryFn: userApi.checkLogin,
    options: {
      enabled: false,
    },
  })

  const [defaultImage, setDefaultImage] = useState(false)

  const setUpAndOpenModal =
    onClick ||
    (() => {
      openModal()
    })

  return (
    <>
      <StyledAvatar>
        {defaultImage ? (
          <DefaultImage onClick={setUpAndOpenModal} />
        ) : (
          <Image
            unoptimized={true} // 외부 url
            src={avatar.picture || ''}
            width='30'
            height='30'
            alt='avatar'
            onError={() => setDefaultImage(true)}
            onClick={setUpAndOpenModal}
          />
        )}
        <StyledName>{avatar.name}</StyledName>
      </StyledAvatar>

      <Modal
        visible={visible}
        title='로그아웃 하시겠습니까?'
        buttons={[
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

              userApi
                .logout()
                .then(() => {
                  addSnackBar('로그아웃 성공')

                  refetch() // checkLogin

                  invalidateQuery({ queryFn: memoApi.getAllMemo })

                  setAllMemos(dummyMemos)

                  router.replace(routes.root)
                })
                .catch((err) => {
                  addSnackBar(`로그아웃 실패😥<br/>${JSON.stringify(err)}`)
                })
            },
          },
        ]}
        onClose={closeModal}
      />
    </>
  )
}

export default Avatar

const StyledAvatar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  align-items: flex-end;
  img {
    cursor: pointer;
    border-radius: 50%;
  }
`
const StyledName = styled.span`
  position: absolute;
  top: 30px;
  right: 0;
  display: block;
  font-size: 10px;
  text-align: right;
  white-space: nowrap;
`
const DefaultImage = styled.span`
  display: inline-block;
  height: 30px;
  width: 30px;
  background: ${OpenColor.green[3]};
  border-radius: 50%;
`
