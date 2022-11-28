import { queryClient, queryKeys } from '../queryClient'

import Header from '../component/Header'
import MemoGrid from '../component/MemoGrid'
import { checkLogin } from '../api/user'
import { useGetAllMemo } from '../hook/useGetAllMemo'
import { useQuery } from '@tanstack/react-query'
import { useStore } from './zustand'

export default function HomePage() {
  const { memos, setMemos } = useStore()
  const { data: isLogin } = useQuery(queryKeys.checkLogin, checkLogin)
  const { data, refetch, isError, isLoading, isFetching } = useGetAllMemo({
    staleTime: 0,
    cacheTime: 0,
  })

  // 로그인 되어있으면 memo 불러오고, 안되어있으면 스토어에 demmyMemo 저장
  if (isError && isLogin) {
    queryClient.setQueryData([queryKeys.getAllMemo], [])
  }

  if (isLoading || isFetching) {
    return <div>로딩중...</div>
  }

  return (
    <>
      <Header title='고영이 메모장 🐈' backButton={false} />
      <MemoGrid memoData={isLogin ? data : memos} refetchAllMemo={refetch} />
    </>
  )
}
