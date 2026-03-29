import { AuthorizedContent } from '@/shared/components/AuthorizedContent'
import Header from '@/shared/components/Header'
import { MemoList } from '@/shared/components/home/MemoList'
import { MockMemoList } from '@/shared/components/home/MockMemoList'

export default function HomePage() {
  return (
    <>
      <Header title='고영이 메모장🐈' backButton={false} />

      <AuthorizedContent
        unauthorizedComponent={<MockMemoList />}
        loadingComponent={
          <p className='text-center text-sm text-gray-400 mt-10'>
            로그인 정보 확인중...
          </p>
        }
      >
        <MemoList />
      </AuthorizedContent>
    </>
  )
}
