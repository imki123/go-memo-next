import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'sonner'

import { authService } from '@/domain/auth/di'

import { routes } from '../../pages'
import { LoginResponseType } from '../apis/userApi'
import useCommonModal from '../hooks/useCommonModal'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: LoginResponseType
  onClick?: () => void
}) => {
  const router = useRouter()

  const { openModal, closeModal, Modal, visible } = useCommonModal()

  const [defaultImage, setDefaultImage] = useState(false)

  const setUpAndOpenModal =
    onClick ||
    (() => {
      openModal()
    })

  return (
    <>
      <div className='relative flex flex-col flex-shrink-0 justify-center items-end'>
        {defaultImage ? (
          <span
            className='inline-block h-[30px] w-[30px] bg-green-300 rounded-full cursor-pointer'
            onClick={setUpAndOpenModal}
          />
        ) : (
          <Image
            unoptimized={true} // 외부 url
            src={avatar.picture || ''}
            width='30'
            height='30'
            alt='avatar'
            onError={() => setDefaultImage(true)}
            onClick={setUpAndOpenModal}
            className='cursor-pointer rounded-full'
          />
        )}
        <span className='absolute top-[30px] right-0 block text-[10px] text-right whitespace-nowrap'>
          {avatar.name}
        </span>
      </div>

      <Modal
        visible={visible}
        title='로그아웃 하시겠습니까?'
        onClose={closeModal}
        buttons={[
          {
            children: '취소',
            onClick: closeModal,
          },
          {
            children: '확인',
            onClick: async () => {
              closeModal()

              try {
                await authService.logout()
                toast.success('로그아웃 성공')
              } catch (err) {
                toast.error(
                  <>
                    로그아웃 실패😥
                    <br />
                    {JSON.stringify(err)}
                  </>
                )
              } finally {
                router.push(routes.root)
                setTimeout(() => {
                  window.location.reload()
                }, 1000)
              }
            },
          },
        ]}
      />
    </>
  )
}

export default Avatar
