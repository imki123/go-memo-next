import { useRouter } from 'next/router'

import { MemoEditor } from '../src/components/memo/MemoEditor'
import { ProtectedContent } from '../src/components/ProtectedContent'

export default function MemoPage() {
  const router = useRouter()
  const memoId = Number(router.query.memoId) || 0

  return (
    <ProtectedContent>
      <MemoEditor memoId={memoId} />
    </ProtectedContent>
  )
}
