import styled from '@emotion/styled'
import OpenColor from 'open-color'
import React from 'react'

import { useThemeStore } from '../../zustand'
import Memo, { MemoModel } from '../molecule/Memo'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */

interface MemoGridModel {
  memoData?: MemoModel[]
}

const MemoGrid = ({ memoData }: MemoGridModel) => {
  const { theme } = useThemeStore()
  return (
    <>
      <Grid theme={theme}>
        {memoData?.map(({ ...props }) => (
          <Memo key={props.memoId} {...props} gridMode={true} />
        ))}
      </Grid>
    </>
  )
}

export default React.memo(MemoGrid)

const Grid = styled.div<{ theme?: 'dark' }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 40px 20px;
  padding: 0 20px 20px;
  background: white;
  ${({ theme }) => theme === 'dark' && `background: ${OpenColor.gray[9]};`}
`
