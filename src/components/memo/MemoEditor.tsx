import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import { memoApi } from '@/apis/memoApi'
import Header from '@/components/Header'
import { Memo, MemoType } from '@/components/Memo'
import { Button } from '@/components/ui/button'
import { lockFacade } from '@/domain/lock/di'
import { queryKeys } from '@/lib/queryKeys'
import { useAllMemosStore } from '@/zustand/useAllMemosStore'
import { useFontSizeStore } from '@/zustand/useFontSizeStore'
import { useMemoHistoryStore } from '@/zustand/useMemoHistoryStore'

type MemoEditorProps = {
  memoId: number
}

export function MemoEditor({ memoId }: MemoEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: isLockedRemote } = lockFacade.query.useLockedStatus()

  const { increaseFontSize, decreaseFontSize, loadFontSizeFromStorage } =
    useFontSizeStore()
  useEffect(() => {
    loadFontSizeFromStorage()
  }, [loadFontSizeFromStorage])

  const { allMemos, setMemo } = useAllMemosStore()
  const [notFound, setNotFound] = useState(false)

  const {
    memoHistories,
    currentIndex,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  const {
    data: memoData,
    isError,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.memoKeys.detail(memoId),
    queryFn: () => memoApi.getMemo(memoId),
    enabled: memoId > 0,
  })

  useEffect(() => {
    if (memoData && memoId > 0) {
      setMemo(memoData as MemoType)
      pushHistory((memoData as MemoType).text || '')
    } else if (memoData && memoId === 0) {
      setNotFound(true)
    }
  }, [memoData, memoId, setMemo, pushHistory])

  const memo = allMemos?.find((item: MemoType) => item.memoId === memoId)
  const title = memo?.text?.split('\n')[0].slice(0, 50)

  useEffect(() => {
    if (memoHistories[currentIndex] !== undefined) {
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
      resetHistory()
    }
  }, [resetHistory])

  return (
    <>
      <Header
        title={title}
        backButtonSize={24}
        onTitleClick={() => textareaRef.current?.scrollTo(0, 0)}
      />

      <div className='h-[calc(100dvh-60px-env(safe-area-inset-bottom))] px-[15px] pb-[15px] flex flex-col items-center gap-[10px]'>
        {isError || (isLockedRemote !== undefined && notFound) ? (
          <div className='text-center'>메모 불러오기 실패 😥</div>
        ) : (
          <>
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

            <Memo
              memoId={memoId || 0}
              fetching={isLockedRemote !== undefined && isFetching}
              ref={textareaRef}
            />
          </>
        )}
      </div>
    </>
  )
}
