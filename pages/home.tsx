import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getAllMemo } from '../api/memo'
import Header from '../component/Header'
import MemoGrid from '../component/MemoGrid'
import { queryKeys } from '../queryClient'

export default function HomePage() {
  const { data, refetch } = useQuery(queryKeys.getAllMemo, getAllMemo, {
    staleTime: 0,
    cacheTime: 0,
  })

  return (
    <>
      <Header title='고영이 메모장 🐈' backButton={false} />
      <MemoGrid memoData={data} refetch={refetch} />
    </>
  )
}
