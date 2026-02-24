import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

import { AuthorizedContent } from '../src/components/AuthorizedContent'
import Header from '../src/components/Header'
import { MemoEditor } from '../src/components/memo/MemoEditor'
import { MockMemoEditor } from '../src/components/memo/MockMemoEditor'

export default function MemoPage() {
  const router = useRouter()
  const memoId = router.isReady ? Number(router.query.memoId) || 0 : 0
  const [title, setTitle] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  if (!router.isReady) {
    return null
  }

  return (
    <>
      <Header
        title={title}
        backButtonSize={24}
        onTitleClick={() => textareaRef?.current?.scrollTo(0, 0)}
      />
      <AuthorizedContent
        unauthorizedComponent={
          <MockMemoEditor
            memoId={memoId}
            setTitle={setTitle}
            textareaRef={textareaRef}
          />
        }
      >
        <MemoEditor
          memoId={memoId}
          key={memoId}
          setTitle={setTitle}
          textareaRef={textareaRef}
        />
      </AuthorizedContent>
    </>
  )
}
