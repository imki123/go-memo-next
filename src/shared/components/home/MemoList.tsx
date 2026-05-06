import { type AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { lockEntity } from '@/domain/lock/entity'
import { useLockService } from '@/domain/lock/hook'
import { useMemoService } from '@/domain/memo/hook'
import { MemoCard } from '@/shared/components/home/MemoCard'
import { texts } from '@/shared/constants/texts'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import FloatingButtonsLayout from './FloatingButtonsLayout'
import ReloadButton from './ReloadButton'

export function MemoList() {
  const router = useRouter()
  const { isLockedLocal, checkLoginQueryResult } = useLockService()
  const { data: checkLoginData } = checkLoginQueryResult
  const isLockedRemote = checkLoginData?.locked ?? false

  const { getAllMemosQuery, createMemo, isLoading, isFetching } =
    useMemoService({
      enabled: lockEntity.isApiCallAllowed({
        isLockedRemote,
        isLockedLocal,
      }),
      shouldFetchAllMemos: true,
    })
  const { data: allMemosData, refetch: allMemosRefetch } = getAllMemosQuery
  const sortedMemos = useMemo(
    () =>
      [...(allMemosData ?? [])].sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [allMemosData]
  )

  const [isAddingMemo, setIsAddingMemo] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchedMemos = sortedMemos.filter((memo) =>
    memo.text?.includes(searchValue)
  )

  async function addMemo() {
    if (
      !lockEntity.isApiCallAllowed({
        isLockedRemote,
        isLockedLocal,
      })
    ) {
      toast.error('계정이 잠겨있습니다. 잠금을 해제해주세요.')
      return
    }

    try {
      setIsAddingMemo(true)
      const response = await createMemo.mutateAsync()
      router.push(`/memo?memoId=${response.memoId}`)
      await allMemosRefetch()
      toast.success('메모 추가 성공')
    } catch (err) {
      console.error(err)
      const error = err as AxiosError
      const title =
        error.response?.data === 'no session'
          ? '로그인이 필요합니다. 😥'
          : '메모 추가에 실패했습니다. 😥'
      toast.error(title)
    } finally {
      setIsAddingMemo(false)
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

        <Button onClick={addMemo} size='sm' disabled={isAddingMemo}>
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
          {searchedMemos.map((memo) => (
            <MemoCard key={memo.memoId} memo={memo} />
          ))}
        </div>
      )}

      <FloatingButtonsLayout>
        <ReloadButton
          isReloading={isFetching}
          onClick={() => {
            if (!isFetching) {
              allMemosRefetch().then(() => toast.success('새로고침 성공'))
            }
          }}
        />
      </FloatingButtonsLayout>
    </>
  )
}
