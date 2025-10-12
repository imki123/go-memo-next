import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import { memoApi } from '../src/apis/memoApi'
import { userApi } from '../src/apis/userApi'
import Header from '../src/components/Header'
import { Memo, MemoType } from '../src/components/Memo'
import { ProtectedContent } from '../src/components/ProtectedContent'
import { useApiQuery } from '../src/lib/queryUtils'
import { useAllMemosStore } from '../src/zustand/useAllMemosStore'
import { useFontSizeStore } from '../src/zustand/useFontSizeStore'
import { useMemoHistoryStore } from '../src/zustand/useMemoHistoryStore'
import { usePasswordScreenStore } from '../src/zustand/usePasswordScreenStore'

export default function MemoPage() {
  const router = useRouter()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: loginData } = useApiQuery({ queryFn: userApi.checkLogin })
  const { isLocked } = usePasswordScreenStore()

  const memoId = Number(router.query.memoId) || 0

  const { increaseFontSize, decreaseFontSize, loadFontSizeFromStorage } =
    useFontSizeStore()
  useEffect(() => {
    // NOTE: 로컬 스토리지에서 폰트 사이즈 가져오기
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
  } = useApiQuery({
    queryFn: memoApi.getMemo,
    payload: memoId,
    options: {
      enabled: !!(loginData && memoId > 0 && !isLocked),
    },
  })

  useEffect(() => {
    // NOTE: 메모 데이터 가져온 후 스토어 업데이트
    if (memoData && memoId && memoId > 0) {
      setMemo(memoData as MemoType)
      pushHistory((memoData as MemoType).text || '')
    } else if (memoData && memoId === 0) {
      setNotFound(true)
    }
  }, [memoData, memoId, setMemo, pushHistory])

  // 현재 id의 memo
  const memo = allMemos?.find((item: MemoType) => item.memoId === memoId)

  const title = memo?.text?.split('\n')[0].slice(0, 50)

  // currentIndex가 변경될 때마다 해당 히스토리로 메모 업데이트
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
    // 페이지 벗어나면 히스토리 지우기
    return () => {
      resetHistory()
    }
  }, [resetHistory])

  return (
    <>
      <Header
        title={title}
        backButtonSize={24}
        onTitleClick={() => {
          textareaRef.current?.scrollTo(0, 0)
        }}
      />

      <ProtectedContent>
        <div className='h-[calc(100dvh-60px-env(safe-area-inset-bottom))] px-[15px] pb-[15px] flex flex-col items-center gap-[10px]'>
          {isError || (loginData && notFound) ? (
            <div className='text-center'>메모 불러오기 실패 😥</div>
          ) : (
            <>
              <div className='flex items-center gap-[10px] pt-[10px]'>
                <Button
                  onClick={increaseFontSize}
                  size='sm'
                  variant='secondary'
                >
                  글씨+
                </Button>

                <Button
                  onClick={decreaseFontSize}
                  size='sm'
                  variant='secondary'
                >
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
                fetching={!!loginData && isFetching}
                ref={textareaRef}
              />
            </>
          )}
        </div>
      </ProtectedContent>
    </>
  )
}
