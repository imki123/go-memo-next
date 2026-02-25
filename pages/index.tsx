import { AuthorizedContent } from '@/components/AuthorizedContent'
import { MockMemoList } from '@/components/home/MockMemoList'

import Header from '../src/components/Header'
import { MemoList } from '../src/components/home/MemoList'

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}

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
