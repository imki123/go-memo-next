import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useMemoService } from '@/domain/memo/hook'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import { MemoCard } from './MemoCard'

export function MockMemoList() {
  const router = useRouter()
  const { getAllMemosLocal, setAllMemosLocal } = useMemoService()
  const allMemos = getAllMemosLocal()

  const sortedMemos = useMemo(
    () =>
      [...allMemos].sort((a, b) => {
        const timeA = dayjs(a.editedAt).valueOf()
        const timeB = dayjs(b.editedAt).valueOf()
        return timeB - timeA
      }),
    [allMemos]
  )

  const [searchValue, setSearchValue] = useState('')
  const searchedMemos = sortedMemos.filter((memo) =>
    memo.text?.includes(searchValue)
  )

  function addMemo() {
    const newId =
      allMemos.reduce((max, memo) => Math.max(max, memo.memoId), 0) + 1 || 1
    setAllMemosLocal([
      ...allMemos,
      {
        memoId: newId,
        text: `메모${newId}`,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        editedAt: dayjs().format('YYYY-MM-DD HH:mm'),
      },
    ])
    router.push(`/memo?memoId=${newId}`)
    toast.success('메모 추가 성공')
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

      <div className='flex flex-wrap gap-5 px-5 pb-5'>
        {searchedMemos.map((memo) => (
          <MemoCard key={memo.memoId} memo={memo} isMock />
        ))}
      </div>
    </>
  )
}
