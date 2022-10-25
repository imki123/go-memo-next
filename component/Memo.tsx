import styled from '@emotion/styled'
import OpenColor from 'open-color'
import moment from 'moment-mini'
import { ChangeEvent, useState } from 'react'

export interface MemoInterface {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
}

export default function Memo({
  // memoId,
  text = '',
  createdAt,
  editedAt,
}: MemoInterface) {
  const [value, setValue] = useState(text)
  const [time, setTime] = useState(
    moment(editedAt || createdAt).format('YYYY-MM-DD HH:mm')
  )
  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setTime(moment().format('YYYY-MM-DD HH:mm'))
  }
  return (
    <MemoWrapper>
      <MemoHeader>{`${time}`}</MemoHeader>
      <StyledTextarea value={value} onChange={changeText} />
    </MemoWrapper>
  )
}

const MemoWrapper = styled.div`
  position: relative;
  flex: 1 0 250px;
  min-height: 200px;
  background: ${OpenColor.yellow[0]};
  border: 2px solid ${OpenColor.yellow[2]};
  border-radius: 8px;
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
`
