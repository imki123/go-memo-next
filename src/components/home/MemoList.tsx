import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { memoApi } from '@/apis/memoApi'
import { Memo } from '@/components/home/Memo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { lockFacade } from '@/domain/lock/facade'
import { queryKeys } from '@/lib/queryKeys'
import { texts } from '@/texts'

import FloatingButtonsLayout from './FloatingButtonsLayout'
import ReloadButton from './ReloadButton'

export function MemoList() {
  const router = useRouter()
  const isLockedLocal = lockFacade.store.watchIsLockedLocal()
  const { data: isLockedRemote } = lockFacade.query.useLockedStatus()

  const {
    data: allMemosData,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.memoKeys.list(),
    queryFn: memoApi.getAllMemo,
    // enabled: lockFacade.lockService.isApiCallAllowed({
    //   isLockedRemote,
    //   isLockedLocal,
    // }),
  })

  const sortedMemos = useMemo(
    () =>
      [...(allMemosData ?? [])].sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [allMemosData]
  )

  const [searchValue, setSearchValue] = useState('')
  const filteredMemos = sortedMemos.filter((memo) =>
    memo.text?.includes(searchValue)
  )

  async function addMemo() {
    if (
      !lockFacade.service.isApiCallAllowed({
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
          <div>{texts.loading}</div>
          <div>{texts.serverRestarting}</div>
        </div>
      ) : (
        <div className='flex flex-wrap gap-5 px-5 pb-5'>
          {filteredMemos.map((memo) => (
            <Memo key={memo.memoId} memo={memo} />
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
