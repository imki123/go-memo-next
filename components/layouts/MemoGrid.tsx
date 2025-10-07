import styled from '@emotion/styled'
import React from 'react'

import { Memo } from '../molecules/Memo'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */

type MemoGridModelType = {
  memoData?: { memoId: number }[]
}

export function MemoGrid({ memoData }: MemoGridModelType) {
  return (
    <>
      <Grid>
        {memoData?.map(({ memoId }) => (
          <Memo key={memoId} memoId={memoId} readOnly={true} />
        ))}
      </Grid>
    </>
  )
}

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 40px 20px;
  padding: 0 20px 20px;
`
