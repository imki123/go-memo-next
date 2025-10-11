import { Memo } from '@/components/Memo'

type MemoGridModelType = {
  memoData?: { memoId: number }[]
}

export function MemoGrid({ memoData }: MemoGridModelType) {
  return (
    <>
      <div className='flex flex-wrap gap-5 px-5 pb-5'>
        {memoData?.map(({ memoId }) => (
          <Memo key={memoId} memoId={memoId} readOnly={true} />
        ))}
      </div>
    </>
  )
}
