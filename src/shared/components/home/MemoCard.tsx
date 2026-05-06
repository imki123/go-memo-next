import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'sonner'

import type { MemoEntity } from '@/domain/memo/entity'
import { useMemoService } from '@/domain/memo/hook'
import useCommonModal from '@/shared/hook/useCommonModal'

type MemoCardProps = {
  memo: MemoEntity
  isMock?: boolean
}

export function MemoCard({ memo, isMock = false }: MemoCardProps) {
  const router = useRouter()
  const { openModal, closeModal, Modal, visible } = useCommonModal()
  const { deleteMemo, deleteMemoLocal } = useMemoService()
  const [isDeletingLocal, setIsDeletingLocal] = useState(false)
  const isDeleting = isMock ? isDeletingLocal : deleteMemo.isPending
  const memoTime =
    memo.editedAt || memo.createdAt
      ? dayjs(memo.editedAt || memo.createdAt).format('YYYY-MM-DD HH:mm')
      : ''

  async function executeDeleteMemo() {
    closeModal()

    if (isMock) {
      setIsDeletingLocal(true)
      deleteMemoLocal(memo.memoId)
      toast.success('메모 삭제 성공')
      return
    }

    try {
      await deleteMemo.mutateAsync(memo.memoId)
      toast.success('메모 삭제 성공')
    } catch (err) {
      toast.error(
        <>
          메모 삭제 실패:
          <br />
          {JSON.stringify(err)}
        </>
      )
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={() => {
          if (!isDeleting) {
            router.push(`/memo?memoId=${memo.memoId}`)
          }
        }}
        disabled={isDeleting}
        className='relative min-w-[250px] h-[300px] w-full sm:w-[calc(50%-10px)] cursor-pointer bg-yellow-50 border-2 border-yellow-300 rounded-lg text-left hover:border-yellow-500 active:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-yellow-300 dark:bg-yellow-900 dark:border-yellow-600'
      >
        <div className='absolute top-0 right-1 flex items-center text-xs text-gray-600 dark:text-gray-400'>
          {memoTime}

          <X
            onClick={(e) => {
              e.stopPropagation()
              if (!isDeleting) {
                openModal()
              }
            }}
            className='ml-1 cursor-pointer text-red-600'
            size={16}
          />
        </div>

        <div className='w-full h-full p-2 pt-3 overflow-hidden whitespace-pre-wrap break-words'>
          {memo.text}
        </div>
      </button>

      <Modal
        visible={visible}
        title='메모를 삭제하시겠습니까?'
        buttons={[
          {
            children: '취소',
            onClick: closeModal,
          },
          {
            children: '삭제',
            variant: 'destructive',
            onClick: executeDeleteMemo,
          },
        ]}
        onClose={closeModal}
      />
    </>
  )
}
