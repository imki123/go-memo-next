import styled from '@emotion/styled'
import OpenColor from 'open-color'
import moment from 'moment-mini'
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { patchMemo } from '../api/memo'

export interface MemoModel {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
}

export default function Memo({
  memoId,
  text = '',
  createdAt,
  editedAt,
  gridMode,
  setMemoData,
}: MemoModel & {
  gridMode?: boolean
  setMemoData?: Dispatch<SetStateAction<MemoModel>>
}) {
  const isChanged = useRef(false)
  const timeoutId = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const [value, setValue] = useState(text)
  const [time, setTime] = useState(
    moment(editedAt || createdAt).format('YYYY-MM-DD HH:mm')
  )

  const updateMemo = (memo: MemoModel) => {
    console.log('수정완료:', memo)
    patchMemo(memo)
  }

  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    isChanged.current = true
    setValue(e.target.value)
    setTime(moment().format('YYYY-MM-DD HH:mm'))
    setMemoData?.((state) => ({
      ...state,
      text: e.target.value,
    }))

    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      updateMemo({
        memoId,
        text: e.target.value,
      })
    }, 1000 * 2)
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
