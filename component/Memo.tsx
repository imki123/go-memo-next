import styled from '@emotion/styled'
import OpenColor from 'open-color'
import moment from 'moment-mini'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'

export interface MemoInterface {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
  gridMode?: boolean
}

export default function Memo({
  memoId,
  text = '',
  createdAt,
  editedAt,
  gridMode,
}: MemoInterface) {
  const router = useRouter()
  const [value, setValue] = useState(text)
  const [time, setTime] = useState(
    moment(editedAt || createdAt).format('YYYY-MM-DD HH:mm')
  )
  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setTime(moment().format('YYYY-MM-DD HH:mm'))
  }

  const clickMemo = (memoId: number) => {
    if (gridMode) {
      router.push(`/memo/${memoId}`)
    }
  }

  return (
    <MemoWrapper onClick={() => clickMemo(memoId)} gridMode={gridMode}>
      <MemoHeader>{`${time}`}</MemoHeader>
      <StyledTextarea value={value} onChange={changeText} disabled={gridMode} />
    </MemoWrapper>
  )
}

const MemoWrapper = styled.div<{ gridMode?: boolean }>`
  position: relative;
  flex: 1 0 250px;
  height: 100%;
  min-height: 200px;
  background: ${OpenColor.yellow[0]};
  border: 2px solid ${OpenColor.yellow[3]};
  border-radius: 8px;
  padding-left: 10px;

  ${({ gridMode }) =>
    gridMode &&
    `
    padding-left: 10px;
    height: auto;
    cursor: pointer;
    :hover{
      border: 2px solid ${OpenColor.yellow[9]};
    }
  `}
`
const MemoHeader = styled.div`
  position: absolute;
  top: 0;
  right: 4px;
  height: 12px;
  font-size: 12px;
  color: ${OpenColor.gray[5]};
  text-align: right;
`
const StyledTextarea = styled.textarea`
  height: 100%;
  padding-top: 12px;
  width: 100%;
  border: 0;
  border-radius: 8px;
  color: inherit;
  background: inherit;
  resize: none;
  outline: none;
  overflow: auto;
  word-break: break-all;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${OpenColor.yellow[5]};
  }
  ${({ disabled }) => disabled && `cursor: pointer;`}
`
