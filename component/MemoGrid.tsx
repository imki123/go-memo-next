import Memo, { MemoModel } from './Memo'
import React, { useState } from 'react'

import { AxiosError } from 'axios'
import Button from './Button'
import { postMemo } from '../api/memo'
import styled from '@emotion/styled'
import useModal from '../hook/useModal'

/**
 * 메모 리스트
 * 컨테이너 최대 너비 800px, 메모장 최대 3열 배치(min-width 150px, 여백 10px)
 * @returns
 */

interface MemoGridModel {
  memoData?: MemoModel[]
  refetchAllMemo?: () => void
}

export default function MemoGrid({ memoData, refetchAllMemo }: MemoGridModel) {
  const { openModal, Modal } = useModal()
  const [noSession, setNoSession] = useState(false)
  return (
    <>
      <ButtonDiv>
        <Button
          onClick={async () => {
            postMemo()
              .then(() => {
                refetchAllMemo?.()
              })
              .catch((err: AxiosError) => {
                console.error(err)
                if (err.response?.data === 'no session') {
                  setNoSession(true)
                } else {
                  setNoSession(false)
                }
                openModal()
              })
          }}
        >
          메모추가
        </Button>
      </ButtonDiv>
      <Grid>
        {memoData?.map(({ ...props }) => (
          <Memo key={props.memoId} {...props} gridMode={true} />
        ))}
      </Grid>
      <Modal
        title={
          <>
            메모 추가에 실패했습니다. 😥
            {noSession ? (
              <>
                <br />
                로그인이 필요합니다.
              </>
            ) : null}
          </>
        }
      />
    </>
  )
}

const ButtonDiv = styled.div`
  text-align: center;
  margin: 10px;
`

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 16px;
  padding: 0 16px 16px;
`
