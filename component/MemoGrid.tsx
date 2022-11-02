import styled from '@emotion/styled'
import React from 'react'
import Memo, { MemoInterface } from './Memo'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */
export default function MemoGrid() {
  const dummy = [
    {
      memoId: 1,
      text: `1행:메모1
2행: Hello!
3행: World!`,
      createdAt: '2022-10-25T23:10:20',
      editedAt: '2022-10-25T23:30:10',
    },
    {
      memoId: 2,
      text: `메모2`,
      createdAt: '2022-10-25T23:10:20',
      editedAt: '2022-10-25T23:30:10',
    },
    {
      memoId: 3,
      text: `메모3`,
      createdAt: '2022-10-25T23:10:20',
      editedAt: '2022-10-25T23:30:10',
    },
    {
      memoId: 4,
      text: `메모4`,
      createdAt: '2022-10-25T23:10:20',
      editedAt: '2022-10-25T23:30:10',
    },
    {
      memoId: 5,
      text: `메모5`,
      createdAt: '2022-10-25T23:10:20',
      editedAt: '2022-10-25T23:30:10',
    },
  ] as MemoInterface[]

  return (
    <Grid>
      {React.Children.toArray(dummy.map(({ ...props }) => <Memo {...props} gridMode={true} />))}
    </Grid>
  )
}

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 10px;
  padding: 10px;
`
