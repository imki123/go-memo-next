import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { memoApi } from '@/apis/memoApi'
import { Memo } from '@/components/Memo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { lockFacade } from '@/domain/lock/di'
import { queryKeys } from '@/lib/queryKeys'
import { useAllMemosStore } from '@/zustand/useAllMemosStore'

import FloatingButtonsLayout from './FloatingButtonsLayout'
import ReloadButton from './ReloadButton'

export function MemoList() {
  const router = useRouter()
  const { allMemos, setAllMemos } = useAllMemosStore()
  const isLockedLocal = lockFacade.store.useIsLockedLocal()
  const { data: isLockedRemote } = lockFacade.query.useLockedStatus()

  const {
    data: allMemosData,
    refetch,
    isLoading,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: queryKeys.memoKeys.list(),
    queryFn: memoApi.getAllMemo,
    enabled: lockFacade.lockService.isApiCallAllowed({
      isLockedRemote,
      isLockedLocal,
    }),
  })

  useEffect(() => {
    if (isLockedRemote !== undefined && allMemosData && isFetched) {
      setAllMemos(allMemosData || [])
    }
  }, [isLockedRemote, allMemosData, setAllMemos, isFetched])

  const sortedMemos = useMemo(
    () =>
      [...(allMemos || [])].sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [allMemos]
  )

  const [searchValue, setSearchValue] = useState('')
  const filteredMemos = sortedMemos.filter((memo) =>
    memo.text?.includes(searchValue)
  )

  async function addMemo() {
    if (
      !lockFacade.lockService.isApiCallAllowed({
        isLockedRemote,
        isLockedLocal,
      })
    ) {
      toast.error('계정이 잠겨있습니다. 잠금을 해제해주세요.')
      return
    }

    try {
      const response = await memoApi.postMemo()
      router.push(`/memo?memoId=${response.memoId}`)
      await refetch()
      toast.success('메모 추가 성공')
    } catch (err) {
      console.error(err)
      const error = err as AxiosError
      const title =
        error.response?.data === 'no session'
          ? '로그인이 필요합니다. 😥'
          : '메모 추가에 실패했습니다. 😥'
      toast.error(title)
    }
  }

  return (
    <>
      <div className='flex justify-between items-center mx-5 gap-5 my-4'>
        <Input
          placeholder='메모 검색'
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          className='w-full max-w-[200px] flex-shrink'
        />

        <Button onClick={addMemo} size='sm'>
          메모추가
        </Button>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center h-[200px]'>
          <div>로딩 중...</div>
          <div>서버 재시작 중에는 1분 정도 소요될 수 있습니다.</div>
        </div>
      ) : (
        <div className='flex flex-wrap gap-5 px-5 pb-5'>
          {filteredMemos.map(({ memoId }) => (
            <Memo key={memoId} memoId={memoId} readOnly={true} />
          ))}
        </div>
      )}

      <FloatingButtonsLayout>
        <ReloadButton
          isReloading={isFetching}
          onClick={() => {
            if (!isFetching)
              refetch().then(() => toast.success('새로고침 성공'))
          }}
        />
      </FloatingButtonsLayout>
    </>
  )
}
