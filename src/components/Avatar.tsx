import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'sonner'

import { routes } from '../../pages'
import { dummyMemos } from '../apis/dummyMemos'
import { memoApi } from '../apis/memoApi'
import { LoginResponseType, userApi } from '../apis/userApi'
import useCommonModal from '../hooks/useCommonModal'
import { useApiQuery, useInvalidation } from '../lib/queryUtils'
import { useAllMemosStore } from '../zustand/useAllMemosStore'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: LoginResponseType
  onClick?: () => void
}) => {
  const router = useRouter()

  const { openModal, closeModal, Modal, visible } = useCommonModal()
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
        buttons={[
          {
            children: '취소',
            onClick: () => {
              closeModal()
            },
          },
          {
            children: '확인',
            onClick: () => {
              closeModal()

              userApi
                .logout()
                .then(() => {
                  toast.success('로그아웃 성공')

                  refetch() // checkLogin

                  invalidateQuery({ queryFn: memoApi.getAllMemo })

                  setAllMemos(dummyMemos)

                  router.replace(routes.root)
                })
                .catch((err) => {
                  toast.error(`로그아웃 실패😥<br/>${JSON.stringify(err)}`)
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
