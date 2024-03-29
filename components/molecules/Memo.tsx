import styled from '@emotion/styled'
import ClearIcon from '@mui/icons-material/Clear'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  forwardRef,
} from 'react'

import { deleteMemo, patchMemo } from '../../apis/memo'
import { useGetAllMemo } from '../../hooks/useGetAllMemo'
import { useGetCheckLogin } from '../../hooks/useGetCheckLogin'
import useModal from '../../hooks/useModal'
import { routes } from '../../pages'
import { addSnackBar } from '../../utils/util'
import { useMemoHistoryStore, useMemoStore } from '../../zustand'

export interface MemoModel {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
  fetching?: boolean
}
export const Memo = forwardRef(_Memo)
function _Memo(
  {
    memoId,
    text = '',
    createdAt,
    editedAt,
    readOnly,
    updateMemos,
    fetching,
    fontSize,
  }: MemoModel & {
    readOnly?: boolean
    fontSize?: number
    updateMemos?: (memo: MemoModel) => void
  },
  forwardedRef: React.LegacyRef<HTMLTextAreaElement>
) {
  // 테마 설정
  const isChanged = useRef(false)
  const timeoutId = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const [value, setValue] = useState(text)
  const [time, setTime] = useState(
    dayjs(editedAt || createdAt).format('YYYY-MM-DD HH:mm')
  )
  const { data: isLogin } = useGetCheckLogin()
  const { openModal, closeModal, Modal, setTitle, setButtons } = useModal()
  const { memos, setMemos } = useMemoStore()
  const { refetch } = useGetAllMemo({ staleTime: 0, enabled: false })
  const { memoHistory, index, pushHistory } = useMemoHistoryStore()

  const updateMemo = useCallback(
    (memo: MemoModel) => {
      if (isLogin) {
        addSnackBar('수정완료')
        patchMemo(memo)
      }
    },
    [isLogin]
  )

  const changeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value

    isChanged.current = true
    setValue(text)
    const now = dayjs().format('YYYY-MM-DD HH:mm')
    setTime(now)

    // 현재 메모데이터 업데이트
    updateMemos?.({
      text: text,
      editedAt: now,
      memoId,
      createdAt,
    })

    // 메모히스토리에 추가 디바운스: 0.5초
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      pushHistory(text)
    }, 1000 * 0.5)
  }

  const clickMemo = (memoId: number) => {
    if (readOnly) {
      router.push(`/memo?memoId=${memoId}`)
    }
  }

  const handleDeleteMemo = (e: MouseEvent<SVGSVGElement>) => {
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
                addSnackBar('메모 삭제 성공')
                refetch()
                if (!readOnly) router.replace(routes.root)
              })
              .catch((err) => {
                addSnackBar(`메모 삭제 실패: <br/>${JSON.stringify(err)}`)
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

  useEffect(() => {
    // 히스토리 변경되면 1.5초후에 서버에 저장
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        updateMemo({
          memoId,
          text: memoHistory[index],
          editedAt: dayjs().format('YYYY-MM-DD HH:mm'),
        })
      }, 1000 * 1.5)
    }
  }, [index, memoHistory, memoId, updateMemo])

  // 메모 변경되면 value도 변경하기
  useEffect(() => {
    setValue(text)
  }, [text])

  return (
    <>
      <StyledMemo
        onClick={() => clickMemo(memoId)}
        readOnly={readOnly}
        fetching={fetching}
      >
        <StyledMemoHeader>
          {`${time}`}
          <StyledClearIcon onClick={handleDeleteMemo} />
        </StyledMemoHeader>
        <StyledTextarea
          value={value}
          onChange={changeText}
          readOnly={readOnly}
          ref={forwardedRef}
          fontSize={fontSize}
        />
      </StyledMemo>
      <Modal />
    </>
  )
}

const StyledMemo = styled.div<{
  readOnly?: boolean
  fetching?: boolean
  theme?: 'dark'
}>`
  position: relative;
  flex: 1 0 250px;
  height: 100%;
  width: 100%;
  min-height: 250px;
  background: ${OpenColor.yellow[0]};
  border: 2px solid ${OpenColor.yellow[3]};
  border-radius: 8px;
  padding-left: 10px;
  :hover,
  :active {
    border: 2px solid ${OpenColor.yellow[5]};
  }

  ${({ readOnly }) =>
    readOnly &&
    `
    padding-left: 10px;
    height: auto;
    cursor: pointer;
  `}
  ${({ fetching }) => fetching && `animation: skeleton 1s linear infinite;`}
  ${({ theme }) =>
    theme.theme === 'dark' &&
    `
    background: #292913;
    border-color: #404030 !important;
  `}
`
const StyledMemoHeader = styled.div`
  position: absolute;
  top: 0;
  right: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${OpenColor.gray[7]};
  text-align: right;
`
const StyledClearIcon = styled(ClearIcon)`
  color: ${OpenColor.red[8]};
  margin-left: 4px;
`
const StyledTextarea = styled.textarea<{ fontSize?: number }>`
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
  ${({ fontSize }) =>
    fontSize ? `font-size: ${fontSize}px;` : `font-size: 14px;`}
  ${({ readOnly }) => readOnly && `cursor: pointer;`}
`
