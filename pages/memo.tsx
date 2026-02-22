import { useRouter } from 'next/router'

import { AuthorizedContent } from '../src/components/AuthorizedContent'
import { MemoEditor } from '../src/components/memo/MemoEditor'

export default function MemoPage() {
  const router = useRouter()
  const memoId = Number(router.query.memoId) || 0

  return (
    <AuthorizedContent>
      <MemoEditor memoId={memoId} />
    </AuthorizedContent>
  )
}
