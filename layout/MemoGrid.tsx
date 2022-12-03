import Memo, { MemoModel } from '../molecule/Memo'

import styled from '@emotion/styled'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */

interface MemoGridModel {
  memoData?: MemoModel[]
}

export default function MemoGrid({ memoData }: MemoGridModel) {
  return (
    <>
      <Grid>
        {memoData?.map(({ ...props }) => (
          <Memo key={props.memoId} {...props} gridMode={true} />
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
