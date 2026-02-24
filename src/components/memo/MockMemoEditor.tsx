import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { MemoType } from '@/components/home/Memo'
import { Button } from '@/components/ui/button'
import useCommonModal from '@/hooks/useCommonModal'
import { useAllMemosStore } from '@/zustand/useAllMemosStore'
import { useFontSizeStore } from '@/zustand/useFontSizeStore'
import { useMemoHistoryStore } from '@/zustand/useMemoHistoryStore'

import { routes } from '../../../pages'

type MockMemoEditorProps = {
  memoId: number
  setTitle?: (title: string) => void
  textareaRef?: React.RefObject<HTMLTextAreaElement>
}

export function MockMemoEditor({
  memoId,
  setTitle,
  textareaRef,
}: MockMemoEditorProps) {
  const router = useRouter()
  const { openModal, closeModal, Modal, visible } = useCommonModal()
  const { increaseFontSize, decreaseFontSize, fontSize } = useFontSizeStore()
  const { allMemos, setMemo, deleteMemo } = useAllMemosStore()
  const memo = allMemos?.find((m: MemoType) => m.memoId === memoId)

  const {
    memoHistories,
    currentIndex,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  useEffect(() => {
    // NOTE: 메모 아이디가 변경되면 히스토리 초기화
    if (memoId > 0) {
      resetHistory()
      setText('')
    }
  }, [memoId, resetHistory])

  const [text, setText] = useState('')
  const textValue = text || memo?.text || ''

  useEffect(() => {
    // NOTE: 타이틀 설정
    if (textValue) {
      setTitle?.(textValue.split('\n')[0].slice(0, 50))
    }
  }, [textValue, setTitle])

  const debounceHistoryTimeoutRef = useRef<NodeJS.Timeout>()
  const debouncePostTimeoutRef = useRef<NodeJS.Timeout>()

  function onChangeTextarea(e: ChangeEvent<HTMLTextAreaElement>) {
    const newText = e.target.value

    clearTimeout(debounceHistoryTimeoutRef.current)
    debounceHistoryTimeoutRef.current = setTimeout(() => {
      pushHistory(newText)
    }, 1000 * 0.5)

    setTextThenDebouncePostMemo(newText)
  }

  function setTextThenDebouncePostMemo(newText: string) {
    setText(newText)

    clearTimeout(debouncePostTimeoutRef.current)
    debouncePostTimeoutRef.current = setTimeout(() => {
      const now = dayjs().format('YYYY-MM-DD HH:mm')
      setMemo({
        memoId,
        text: newText,
        editedAt: now,
        createdAt: (memo as MemoType)?.createdAt || now,
      })
      toast.success('수정완료', {
        duration: 1000 * 0.5,
      })
    }, 1000 * 1.5)
  }

  const memoTime =
    memo &&
    dayjs((memo as MemoType).editedAt || (memo as MemoType).createdAt).format(
      'YYYY-MM-DD HH:mm'
    )

  return (
    <>
      <div className='h-[calc(100dvh-60px-env(safe-area-inset-bottom))] px-[15px] pb-[15px] flex flex-col items-center gap-[10px]'>
        <div className='flex items-center gap-[10px] pt-[10px]'>
          <Button onClick={increaseFontSize} size='sm' variant='secondary'>
            글씨+
          </Button>

          <Button onClick={decreaseFontSize} size='sm' variant='secondary'>
            글씨-
          </Button>

          <Button
            onClick={() => {
              backHistory()
              setText(memoHistories[currentIndex - 1])
              setTextThenDebouncePostMemo(memoHistories[currentIndex - 1])
            }}
            size='sm'
            variant='secondary'
          >
            뒤로
          </Button>

          <Button
            onClick={() => {
              nextHistory()
              setText(memoHistories[currentIndex + 1])
              setTextThenDebouncePostMemo(memoHistories[currentIndex + 1])
            }}
            size='sm'
            variant='secondary'
          >
            앞으로
          </Button>
        </div>

        <div className='relative flex-1 min-h-[250px] w-full min-w-[250px] bg-yellow-50 border-2 border-yellow-300 rounded-lg dark:bg-yellow-900 dark:border-yellow-600'>
          <div className='absolute top-0 right-1 flex items-center text-xs text-gray-600 dark:text-gray-400'>
            {memoTime}
            <X
              onClick={() => {
                openModal()
              }}
              className='ml-1 cursor-pointer text-red-600'
              size={16}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={textValue}
            onChange={onChangeTextarea}
            style={{ fontSize }}
            className='w-full h-full min-h-[200px] p-2 pt-3 border-0 outline-0 resize-none bg-transparent'
          />
        </div>
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
            onClick: () => {
              deleteMemo(memoId)
              closeModal()
              toast.success('메모 삭제 성공')
              router.replace(routes.root)
            },
          },
        ]}
        onClose={closeModal}
      />
    </>
  )
}
