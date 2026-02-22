import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { ChangeEvent, MouseEvent, forwardRef, useRef } from 'react'
import { toast } from 'sonner'

import { routes } from '../../pages'
import { memoApi } from '../apis/memoApi'
import { lockFacade } from '../domain/lock/di'
import useCommonModal from '../hooks/useCommonModal'
import { queryKeys } from '../lib/queryKeys'
import { useAllMemosStore } from '../zustand/useAllMemosStore'
import { useFontSizeStore } from '../zustand/useFontSizeStore'
import { useMemoHistoryStore } from '../zustand/useMemoHistoryStore'

export type MemoType = {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
  fetching?: boolean
}
export const Memo = forwardRef(_Memo)
function _Memo(
  {
    memoId,
    readOnly,
    fetching,
  }: {
    memoId: number
    fetching?: boolean
    readOnly?: boolean
  },
  forwardedRef: React.LegacyRef<HTMLTextAreaElement>
) {
  const router = useRouter()

  const { data: isLockedRemote } = lockFacade.query.useLockedStatus()
  const isLockedLocal = lockFacade.store.useIsLockedLocal()
  const { openModal, closeModal, Modal, visible } = useCommonModal()
  const { allMemos, setMemo, deleteMemo } = useAllMemosStore()
  const { fontSize } = useFontSizeStore()

  const currentMemo = allMemos?.find((memo) => memo.memoId === memoId)
  const memoText = currentMemo?.text || ''

  const { pushHistory } = useMemoHistoryStore()
  const queryClient = useQueryClient()

  const debounceTimeoutId = useRef<NodeJS.Timeout>()
  const fetchTimeoutId = useRef<NodeJS.Timeout>()

  function setMemoAndPushHistory(e: ChangeEvent<HTMLTextAreaElement>) {
    const newText = e.target.value

    const now = dayjs().format('YYYY-MM-DD HH:mm')

    const newMemo = {
      memoId,
      text: newText,
      editedAt: now,
      createdAt: currentMemo?.createdAt || now,
    }

    setMemo(newMemo)

    // 메모히스토리에 추가 디바운스: 0.5초
    clearTimeout(debounceTimeoutId.current)
    debounceTimeoutId.current = setTimeout(async () => {
      pushHistory(newText)
    }, 1000 * 0.5)

    clearTimeout(fetchTimeoutId.current)
    fetchTimeoutId.current = setTimeout(async () => {
      if (
        lockFacade.lockService.isApiCallAllowed({
          isLockedRemote,
          isLockedLocal,
        })
      ) {
        try {
          await memoApi.patchMemo(newMemo)
          queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })

          toast.success('수정완료')
        } catch (error) {
          console.error('메모 수정 실패:', error)
        }
      }
    }, 1000 * 1.5)
  }

  function clickMemo(memoId: number) {
    if (readOnly) {
      router.push(`/memo?memoId=${memoId}`)
    }
  }

  function handleDeleteMemo(e: MouseEvent<SVGSVGElement>) {
    e.stopPropagation()
    openModal()
  }

  const memoTime = currentMemo
    ? dayjs(currentMemo.editedAt || currentMemo.createdAt).format(
        'YYYY-MM-DD HH:mm'
      )
    : ''
  return (
    <>
      <div
        onClick={() => clickMemo(memoId)}
        className={`relative min-w-[250px] bg-yellow-50 border-2 border-yellow-300 rounded-lg hover:border-yellow-500 active:border-yellow-500 ${
          readOnly
            ? 'h-[300px] cursor-pointer w-full sm:w-[calc(50%-10px)]'
            : 'h-full min-h-[250px] w-full'
        } ${
          fetching ? 'animate-pulse' : ''
        } dark:bg-yellow-900 dark:border-yellow-600`}
      >
        <div className='absolute top-0 right-1 flex items-center text-xs text-gray-600 dark:text-gray-400'>
          {memoTime}
          <X
            onClick={handleDeleteMemo}
            className='ml-1 cursor-pointer text-red-600'
            size={16}
          />
        </div>

        <textarea
          value={memoText}
          onChange={setMemoAndPushHistory}
          readOnly={readOnly}
          ref={forwardedRef}
          style={{ fontSize: fontSize }}
          className={`w-full p-2 pt-3 border-0 outline-0 resize-none bg-transparent ${
            readOnly
              ? 'h-full cursor-pointer overflow-hidden'
              : 'h-full min-h-[200px]'
          }`}
        />
      </div>

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
            onClick: async () => {
              closeModal()
              if (
                lockFacade.lockService.isApiCallAllowed({
                  isLockedRemote,
                  isLockedLocal,
                })
              ) {
                try {
                  await memoApi.deleteMemo(memoId)
                  toast.success('메모 삭제 성공')
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.memoKeys.list(),
                  })
                  if (!readOnly) router.replace(routes.root)
                } catch (err) {
                  toast.error(
                    <>
                      메모 삭제 실패:
                      <br />
                      {JSON.stringify(err)}
                    </>
                  )
                }
              } else {
                deleteMemo(memoId)
              }
            },
          },
        ]}
        onClose={closeModal}
      />
    </>
  )
}
