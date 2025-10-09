import { Memo } from './Memo'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */

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
