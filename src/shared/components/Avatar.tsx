import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'sonner'

import { LoginResponseType } from '@/apis/userApi'
import { routePaths } from '@/app/routePaths'
import { useAuthService } from '@/domain/auth/useAuthService'
import { useLockActions } from '@/domain/lock/hook'
import useCommonModal from '@/shared/hook/useCommonModal'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: LoginResponseType
  onClick?: () => void
}) => {
  const router = useRouter()
  const {
    action: { logout },
  } = useAuthService()
  const { setIsLockedLocal } = useLockActions()

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
            unoptimized={true}
            src={avatar.picture || 'unknown'}
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
                await logout()
                setIsLockedLocal(undefined)
                toast.success('로그아웃 성공')
                router.push(routePaths.root)
              } catch (err) {
                toast.error(
                  <>
                    로그아웃 실패😥
                    <br />
                    {JSON.stringify(err)}
                  </>
                )
              }
            },
          },
        ]}
      />
    </>
  )
}

export default Avatar

