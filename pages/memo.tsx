import styled from '@emotion/styled'
import dayjs from 'dayjs'
import { Button } from 'go-storybook'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import { useEffect, useRef, useState } from 'react'

import { memoApi } from '../apis/memoApi'
import { userApi } from '../apis/userApi'
import Header from '../components/molecules/Header'
import { Memo, MemoType } from '../components/molecules/Memo'
import { useApiQuery } from '../lib/queryUtils'
import { HEADER_HEIGHT } from '../styles/GlobalStyle'
import { useAllMemosStore } from '../zustand/useAllMemosStore'
import { useFontSizeStore } from '../zustand/useFontSizeStore'
import { useMemoHistoryStore } from '../zustand/useMemoHistoryStore'

export default function MemoPage() {
  const router = useRouter()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: isLogin } = useApiQuery({ queryFn: userApi.checkLogin })

  const memoId = Number(router.query.memoId) || 0

  const { increaseFontSize, decreaseFontSize, loadFontSizeFromStorage } =
    useFontSizeStore()
  useEffect(() => {
    // NOTE: 로컬 스토리지에서 폰트 사이즈 가져오기
    loadFontSizeFromStorage()
  }, [loadFontSizeFromStorage])

  const { allMemos, setMemo } = useAllMemosStore()
  const [notFound, setNotFound] = useState(false)

  const {
    memoHistories,
    currentIndex,
    backHistory,
    nextHistory,
    resetHistory,
    pushHistory,
  } = useMemoHistoryStore()

  const {
    data: memoData,
    isError,
    isFetched,
    isFetching,
  } = useApiQuery({
    queryFn: memoApi.getMemo,
    payload: memoId,
    options: {
      enabled: isLogin && memoId > 0,
    },
  })

  useEffect(() => {
    // NOTE: 메모 데이터 가져온 후 스토어 업데이트
    if (memoData && memoId && memoId > 0) {
      setMemo(memoData)
      pushHistory(memoData.text || '')
    } else if (memoData && memoId === 0) {
      setNotFound(true)
    }
  }, [memoData, memoId, setMemo])

  // 현재 id의 memo
  const memo = allMemos?.find((item: MemoType) => item.memoId === memoId)

  const title = memo?.text?.split('\n')[0].slice(0, 50)

  // currentIndex가 변경될 때마다 해당 히스토리로 메모 업데이트
  useEffect(() => {
    if (memoHistories[currentIndex] !== undefined) {
      setMemo({
        memoId,
        text: memoHistories[currentIndex],
        editedAt: dayjs().format('YYYY-MM-DD HH:mm'),
        createdAt: memo?.createdAt,
      })
    }
  }, [currentIndex, memoHistories, memoId, setMemo, memo?.createdAt])

  useEffect(() => {
    // 페이지 벗어나면 히스토리 지우기
    return () => {
      resetHistory()
    }
  }, [resetHistory])

  return (
    <>
      <Header
        title={title}
        onTitleClick={() => {
          textareaRef.current?.scrollTo(0, 0)
        }}
      />

      <StyledPageDiv>
        {isError || (isLogin && notFound) ? (
          <StyledCenter>메모 불러오기 실패 😥</StyledCenter>
        ) : (
          <>
            <ButtonDiv>
              <Button onClick={increaseFontSize}>글씨+</Button>

              <Button onClick={decreaseFontSize}>글씨-</Button>

              <Button onClick={backHistory}>뒤로</Button>

              <Button onClick={nextHistory}>앞으로</Button>
            </ButtonDiv>

            <Memo
              memoId={memoId || 0}
              fetching={!!isLogin && isFetching}
              ref={textareaRef}
            />
          </>
        )}
      </StyledPageDiv>
    </>
  )
}

const StyledPageDiv = styled.div`
  height: calc(100dvh - ${HEADER_HEIGHT}px - env(safe-area-inset-bottom));
  padding: 0 15px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
const StyledCenter = styled.div`
  text-align: center;
`

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
  button {
    font-size: 10px;
    width: 40px;
    height: 30px;
    padding: 0;
    background: ${OpenColor.yellow[7]};
  }
`
