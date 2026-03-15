import { AuthorizedContent } from '@/shared/components/AuthorizedContent'
import Header from '@/shared/components/Header'
import { MemoList } from '@/shared/components/home/MemoList'
import { MockMemoList } from '@/shared/components/home/MockMemoList'

export default function HomePage() {
  return (
    <>
      <Header title='고영이 메모장🐈' backButton={false} />

      <AuthorizedContent unauthorizedComponent={<MockMemoList />}>
        <MemoList />
      </AuthorizedContent>
    </>
  )
}
