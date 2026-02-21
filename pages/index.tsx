import Header from '../src/components/Header'
import { MemoList } from '../src/components/home/MemoList'
import { ProtectedContent } from '../src/components/ProtectedContent'

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}

export default function IndexPage() {
  return (
    <>
      <Header title='고영이 메모장🐈' backButton={false} />

      <ProtectedContent>
        <MemoList />
      </ProtectedContent>
    </>
  )
}
