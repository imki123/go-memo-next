import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/apis/userApi'
import { MockMemoList } from '@/components/home/MockMemoList'
import { queryKeys } from '@/lib/queryKeys'

import Header from '../src/components/Header'
import { MemoList } from '../src/components/home/MemoList'

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}

export default function IndexPage() {
  const { data: loginData, isFetching } = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: userApi.checkLogin,
  })

  return (
    <>
      <Header title='고영이 메모장🐈' backButton={false} />

      {loginData && !isFetching ? <MemoList /> : <MockMemoList />}
    </>
  )
}
