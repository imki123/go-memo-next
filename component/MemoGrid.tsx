import styled from '@emotion/styled'
import React from 'react'
import { dummyMemo } from '../dummy/dummyMemo'
import Memo from './Memo'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */

export default function MemoGrid() {
  return (
    <Grid>
      {React.Children.toArray(
        dummyMemo.map(({ ...props }) => <Memo {...props} gridMode={true} />)
      )}
    </Grid>
  )
}

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 10px;
  padding: 0 10px 10px;
`
