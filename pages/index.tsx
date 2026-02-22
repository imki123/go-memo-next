import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/apis/userApi'
import { MockMemoList } from '@/components/home/MockMemoList'
import { authService } from '@/domain/auth/di'
import { lockFacade } from '@/domain/lock/facade'
import { queryKeys } from '@/lib/queryKeys'
import { texts } from '@/texts'

import Header from '../src/components/Header'
import { MemoList } from '../src/components/home/MemoList'

export const routes = {
  root: '/',
  login: '/login',
  memo: '/memo',
}

export default function HomePage() {
  const { data: loginData, isFetching } = useQuery({
    queryKey: queryKeys.userKeys.checkLogin(),
    queryFn: userApi.checkLogin,
  })

  const isAuthenticated = authService.isAuthenticated()
  const isLockedLocal = lockFacade.store.useIsLockedLocal()

  return (
    <>
      <Header title='고영이 메모장🐈' backButton={false} />

      {isFetching ? (
        <div className='flex flex-col items-center justify-center h-[200px] text-lg'>
          <div>{texts.loading}</div>
          <div>{texts.serverRestarting}</div>
        </div>
      ) : (
        <>{loginData?.token ? <MemoList /> : <MockMemoList />}</>
      )}
    </>
  )
}
