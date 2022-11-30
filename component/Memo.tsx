import { ChangeEvent, useRef, useState } from 'react'
import { deleteMemo, patchMemo } from '../api/memo'

import ClearIcon from '@mui/icons-material/Clear'
import { MouseEvent } from 'react'
import OpenColor from 'open-color'
import moment from 'moment-mini'
import produce from 'immer'
import styled from '@emotion/styled'
import { useGetAllMemo } from '../hook/useGetAllMemo'
import { useGetCheckLogin } from '../hook/useGetCheckLogin'
import { useMemoStore } from '../util/zustand'
import useModal from '../hook/useModal'
import { useRouter } from 'next/router'

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
  setMemoData?: (memo: MemoModel) => void
}) {
  const isChanged = useRef(false)
  const timeoutId = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const [value, setValue] = useState(text)
  const [time, setTime] = useState(
    moment(editedAt || createdAt).format('YYYY-MM-DD HH:mm:ss')
  )
  const { data: isLogin } = useGetCheckLogin()
  const { openModal, closeModal, Modal, setTitle, setButtons } = useModal()
  const { memos, setMemos } = useMemoStore()
  const { refetch } = useGetAllMemo({ staleTime: 0, enabled: false })

  const updateMemo = (memo: MemoModel) => {
    console.info('수정완료:', memo)
    if (isLogin) patchMemo(memo)
  }

  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    isChanged.current = true
    setValue(e.target.value)
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    setTime(now)
    setMemoData?.({
      text: e.target.value,
      editedAt: now,
      memoId,
      createdAt,
    })

    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      updateMemo({
        memoId,
        text: e.target.value,
        editedAt: now,
      })
    }, 1000 * 1.5)
  }

  const clickMemo = (memoId: number) => {
    if (gridMode) {
      router.push(`/memo/${memoId}`)
    }
  }

  const deleteMemoAction = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    openModal()
    setTitle(`메모를 삭제하시겠습니까?`)
    setButtons([
      {
        text: '취소',
        onClick: closeModal,
      },
      {
        text: '삭제',
        onClick: () => {
          closeModal()
          if (isLogin) {
            deleteMemo(memoId)
              .then(() => {
                refetch()
                router.replace('/home')
              })
              .catch((err) => {
                openModal()
                setTitle(`메모 삭제 실패: ${JSON.stringify(err)}`)
                setButtons([])
              })
          } else {
            const result = produce(memos, (draft) => {
              return draft?.filter((item) => item.memoId !== memoId)
            })
            setMemos(result)
          }
        },
      },
    ])
  }

  return (
    <>
      <MemoWrapper onClick={() => clickMemo(memoId)} gridMode={gridMode}>
        <MemoHeader>
          {`${time}`}
          <StyledClearIcon onClick={deleteMemoAction} />
        </MemoHeader>
        <StyledTextarea
          value={value}
          onChange={changeText}
          disabled={gridMode}
        />
      </MemoWrapper>
      <Modal />
    </>
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
  :hover,
  :active {
    border: 2px solid ${OpenColor.yellow[5]};
  }

  ${({ gridMode }) =>
    gridMode &&
    `
    padding-left: 10px;
    height: auto;
    cursor: pointer;
  `}
`
const MemoHeader = styled.div`
  position: absolute;
  top: 0;
  right: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${OpenColor.gray[5]};
  text-align: right;
`
const StyledClearIcon = styled(ClearIcon)`
  color: ${OpenColor.red[8]};
  margin-left: 10px;
`
const StyledTextarea = styled.textarea`
  height: 100%;
  padding-top: 18px;
  width: 100%;
  border: 0;
  border-radius: 8px;
  color: inherit;
  background: inherit;
  resize: none;
  outline: none;
  overflow: auto;
  word-break: break-all;
  ${({ disabled }) => disabled && `cursor: pointer;`}
`
