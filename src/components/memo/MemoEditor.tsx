import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { memoApi } from '@/apis/memoApi'
import { MemoType } from '@/components/home/Memo'
import { Button } from '@/components/ui/button'
import { lockFacade } from '@/domain/lock/facade'
import useCommonModal from '@/hooks/useCommonModal'
import { queryKeys } from '@/lib/queryKeys'
import { useFontSizeStore } from '@/zustand/useFontSizeStore'
import { useMemoHistoryStore } from '@/zustand/useMemoHistoryStore'

import { routes } from '../../../pages'

type ScrollToTopRef = React.MutableRefObject<(() => void) | null>

type MemoEditorProps = {
  memoId: number
  setTitle?: (title: string) => void
  scrollToTopRef?: ScrollToTopRef
}

export function MemoEditor({
  memoId,
  setTitle: setTitleProp,
  scrollToTopRef,
}: MemoEditorProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: isLockedRemote } = lockFacade.query.useLockedStatus()
  const isLockedLocal = lockFacade.store.watchIsLockedLocal()
  const { openModal, closeModal, Modal, visible } = useCommonModal()

  const { increaseFontSize, decreaseFontSize, loadFontSizeFromStorage } =
    useFontSizeStore()
  const { fontSize } = useFontSizeStore()
  useEffect(() => {
    loadFontSizeFromStorage()
  }, [loadFontSizeFromStorage])

  const [text, setText] = useState('')
  const [notFound, setNotFound] = useState(false)
  const initialSyncDone = useRef(false)
  const prevHistoryIndex = useRef<number | null>(null)
  const historyNavigationTriggered = useRef(false)

  const {
    memoHistories,
    currentIndex,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  const queryClient = useQueryClient()
  const debounceTimeoutId = useRef<NodeJS.Timeout>()
  const fetchTimeoutId = useRef<NodeJS.Timeout>()

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
    if (memoId <= 0) return
    if (!memoData) return
    if (initialSyncDone.current) return
    initialSyncDone.current = true
    const initialText = memoData?.text ?? ''
    setText(initialText)
    pushHistory(initialText)
  }, [memoId, memoData, pushHistory])

  useEffect(() => {
    if (memoData && memoId === 0) {
      setNotFound(true)
    }
  }, [memoData, memoId])

  useEffect(() => {
    if (memoHistories[currentIndex] === undefined) return
    const historyText = memoHistories[currentIndex]
    setText(historyText)
    const isHistoryNavigation =
      initialSyncDone.current &&
      prevHistoryIndex.current !== null &&
      prevHistoryIndex.current !== currentIndex
    prevHistoryIndex.current = currentIndex
    const shouldPatchFromHistory =
      isHistoryNavigation && historyNavigationTriggered.current
    historyNavigationTriggered.current = false
    if (
      !shouldPatchFromHistory ||
      !lockFacade.service.isApiCallAllowed({
        isLockedRemote,
        isLockedLocal,
      })
    )
      return
    const now = dayjs().format('YYYY-MM-DD HH:mm')
    const newMemo: MemoType = {
      memoId,
      text: historyText,
      editedAt: now,
      createdAt: (memoData as MemoType)?.createdAt || now,
    }
    memoApi
      .patchMemo(newMemo)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
        queryClient.invalidateQueries({
          queryKey: queryKeys.memoKeys.detail(memoId),
        })
        toast.success('수정완료')
      })
      .catch((error) => console.error('메모 수정 실패:', error))
  }, [
    currentIndex,
    memoHistories,
    memoId,
    memoData,
    isLockedRemote,
    isLockedLocal,
    queryClient,
  ])

  useEffect(() => {
    return () => {
      initialSyncDone.current = false
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

    clearTimeout(debounceTimeoutId.current)
    debounceTimeoutId.current = setTimeout(() => {
      pushHistory(newText)
    }, 1000 * 0.5)

    clearTimeout(fetchTimeoutId.current)
    fetchTimeoutId.current = setTimeout(async () => {
      if (
        !lockFacade.service.isApiCallAllowed({
          isLockedRemote,
          isLockedLocal,
        })
      )
        return
      const now = dayjs().format('YYYY-MM-DD HH:mm')
      const newMemo: MemoType = {
        memoId,
        text: newText,
        editedAt: now,
        createdAt: (memoData as MemoType)?.createdAt || now,
      }
      try {
        await memoApi.patchMemo(newMemo)
        queryClient.invalidateQueries({ queryKey: queryKeys.memoKeys.list() })
        queryClient.invalidateQueries({
          queryKey: queryKeys.memoKeys.detail(memoId),
        })
        toast.success('수정완료')
      } catch (error) {
        console.error('메모 수정 실패:', error)
      }
    }, 1000 * 1.5)
  }

  function handleDeleteMemo(e: MouseEvent<SVGSVGElement>) {
    e.stopPropagation()
    openModal()
  }

  const memoTime =
    memoData &&
    dayjs(
      (memoData as MemoType).editedAt || (memoData as MemoType).createdAt
    ).format('YYYY-MM-DD HH:mm')

  return (
    <>
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

              <Button
                onClick={() => {
                  historyNavigationTriggered.current = true
                  backHistory()
                }}
                size='sm'
                variant='secondary'
              >
                뒤로
              </Button>

              <Button
                onClick={() => {
                  historyNavigationTriggered.current = true
                  nextHistory()
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
                className={`w-full h-full min-h-[200px] p-2 pt-3 border-0 outline-0 resize-none bg-transparent ${
                  isLockedRemote !== undefined && isFetching
                    ? 'animate-pulse'
                    : ''
                }`}
              />
            </div>
          </>
        )}
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
                !lockFacade.service.isApiCallAllowed({
                  isLockedRemote,
                  isLockedLocal,
                })
              )
                return
              try {
                await memoApi.deleteMemo(memoId)
                toast.success('메모 삭제 성공')
                queryClient.invalidateQueries({
                  queryKey: queryKeys.memoKeys.list(),
                })
                queryClient.invalidateQueries({
                  queryKey: queryKeys.memoKeys.detail(memoId),
                })
                router.replace(routes.root)
              } catch (err) {
                toast.error(
                  <>
                    메모 삭제 실패:
                    <br />
                    {JSON.stringify(err)}
                  </>
                )
              }
            },
          },
        ]}
        onClose={closeModal}
      />
    </>
  )
}
