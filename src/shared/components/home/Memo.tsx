import dayjs from 'dayjs'
import { useRouter } from 'next/router'

export type MemoType = {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
  fetching?: boolean
}

type MemoProps = {
  memo: MemoType
}

export function Memo({ memo }: MemoProps) {
  const router = useRouter()
  const memoTime =
    memo.editedAt || memo.createdAt
      ? dayjs(memo.editedAt || memo.createdAt).format('YYYY-MM-DD HH:mm')
      : ''

  return (
    <div
      onClick={() => router.push(`/memo?memoId=${memo.memoId}`)}
      className='relative min-w-[250px] h-[300px] w-full sm:w-[calc(50%-10px)] cursor-pointer bg-yellow-50 border-2 border-yellow-300 rounded-lg hover:border-yellow-500 active:border-yellow-500 dark:bg-yellow-900 dark:border-yellow-600'
    >
      <div className='absolute top-0 right-1 flex items-center text-xs text-gray-600 dark:text-gray-400'>
        {memoTime}
      </div>
      <div className='w-full h-full p-2 pt-3 overflow-hidden whitespace-pre-wrap break-words'>
        {memo.text}
      </div>
    </div>
  )
}
