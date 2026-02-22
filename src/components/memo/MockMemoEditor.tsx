import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'

import { MemoType } from '@/components/home/Memo'
import { Button } from '@/components/ui/button'
import useCommonModal from '@/hooks/useCommonModal'
import { useAllMemosStore } from '@/zustand/useAllMemosStore'
import { useFontSizeStore } from '@/zustand/useFontSizeStore'
import { useMemoHistoryStore } from '@/zustand/useMemoHistoryStore'

import { routes } from '../../../pages'

type ScrollToTopRef = React.MutableRefObject<(() => void) | null>

type MockMemoEditorProps = {
  memoId: number
  setTitle?: (title: string) => void
  scrollToTopRef?: ScrollToTopRef
}

export function MockMemoEditor({
  memoId,
  setTitle: setTitleProp,
  scrollToTopRef,
}: MockMemoEditorProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { openModal, closeModal, Modal, visible } = useCommonModal()

  const { increaseFontSize, decreaseFontSize, loadFontSizeFromStorage } =
    useFontSizeStore()
  const { fontSize } = useFontSizeStore()
  useEffect(() => {
    loadFontSizeFromStorage()
  }, [loadFontSizeFromStorage])

  const { allMemos, setMemo, deleteMemo } = useAllMemosStore()
  const memo = allMemos?.find((m: MemoType) => m.memoId === memoId)
  const [text, setText] = useState(memo?.text ?? '')
  const syncFromStore = useRef(false)

  const {
    memoHistories,
    currentIndex,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  const debounceTimeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (memo?.text !== undefined && !syncFromStore.current) {
      setText(memo.text)
      syncFromStore.current = true
      pushHistory(memo.text)
    }
  }, [memo?.text, memo?.memoId, pushHistory])

  useEffect(() => {
    if (memoHistories[currentIndex] !== undefined) {
      setText(memoHistories[currentIndex])
      setMemo({
        memoId,
        text: memoHistories[currentIndex],
        editedAt: dayjs().format('YYYY-MM-DD HH:mm'),
        createdAt: memo?.createdAt,
      })
    }
  }, [currentIndex, memoHistories, memoId, setMemo, memo?.createdAt])

  useEffect(() => {
    return () => {
      syncFromStore.current = false
      resetHistory()
    }
  }, [memoId, resetHistory])

  useEffect(() => {
    setTitleProp?.(text.split('\n')[0].slice(0, 50))
  }, [text, setTitleProp])

  useEffect(() => {
    if (!scrollToTopRef) return
    scrollToTopRef.current = () => textareaRef.current?.scrollTo(0, 0)
    return () => {
      scrollToTopRef.current = null
    }
  }, [scrollToTopRef])

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const newText = e.target.value
    setText(newText)
    const now = dayjs().format('YYYY-MM-DD HH:mm')
    setMemo({
      memoId,
      text: newText,
      editedAt: now,
      createdAt: memo?.createdAt || now,
    })
    clearTimeout(debounceTimeoutId.current)
    debounceTimeoutId.current = setTimeout(() => pushHistory(newText), 500)
  }

  function handleDeleteMemo(e: MouseEvent<SVGSVGElement>) {
    e.stopPropagation()
    openModal()
  }

  const memoTime = memo
    ? dayjs(memo.editedAt || memo.createdAt).format('YYYY-MM-DD HH:mm')
    : ''

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
          <Button onClick={backHistory} size='sm' variant='secondary'>
            뒤로
          </Button>
          <Button onClick={nextHistory} size='sm' variant='secondary'>
            앞으로
          </Button>
        </div>

        <div className='relative flex-1 min-h-[250px] w-full min-w-[250px] bg-yellow-50 border-2 border-yellow-300 rounded-lg dark:bg-yellow-900 dark:border-yellow-600'>
          <div className='absolute top-0 right-1 flex items-center text-xs text-gray-600 dark:text-gray-400'>
            {memoTime}
            <X
              onClick={handleDeleteMemo}
              className='ml-1 cursor-pointer text-red-600'
              size={16}
            />
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
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
              closeModal()
              deleteMemo(memoId)
              router.replace(routes.root)
            },
          },
        ]}
        onClose={closeModal}
      />
    </>
  )
}
