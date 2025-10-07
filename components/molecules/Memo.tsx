import styled from '@emotion/styled'
import ClearIcon from '@mui/icons-material/Clear'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import React, { ChangeEvent, MouseEvent, forwardRef, useRef } from 'react'

import { memoApi } from '../../apis/memoApi'
import { userApi } from '../../apis/userApi'
import useModal from '../../hooks/useModal'
import { useApiQuery, useInvalidation } from '../../lib/queryUtils'
import { routes } from '../../pages'
import { addSnackBar } from '../../utils/util'
import { useAllMemosStore } from '../../zustand/useAllMemosStore'
import { useFontSizeStore } from '../../zustand/useFontSizeStore'
import { useMemoHistoryStore } from '../../zustand/useMemoHistoryStore'

export type MemoType = {
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
    readOnly,
    fetching,
  }: {
    memoId: number
    fetching?: boolean
    readOnly?: boolean
  },
  forwardedRef: React.LegacyRef<HTMLTextAreaElement>
) {
  const router = useRouter()

  const { data: isLogin } = useApiQuery({ queryFn: userApi.checkLogin })
  const { openModal, closeModal, Modal, setTitle, setButtons } = useModal()
  const { allMemos, setMemo, deleteMemo } = useAllMemosStore()
  const { fontSize } = useFontSizeStore()

  const currentMemo = allMemos?.find((memo) => memo.memoId === memoId)
  const memoText = currentMemo?.text || ''

  const { pushHistory } = useMemoHistoryStore()
  const { invalidateQuery } = useInvalidation()

  const debounceTimeoutId = useRef<NodeJS.Timeout>()
  const fetchTimeoutId = useRef<NodeJS.Timeout>()

  function setMemoAndPushHistory(e: ChangeEvent<HTMLTextAreaElement>) {
    const newText = e.target.value

    const now = dayjs().format('YYYY-MM-DD HH:mm')

    const newMemo = {
      memoId,
      text: newText,
      editedAt: now,
      createdAt: currentMemo?.createdAt || now,
    }

    setMemo(newMemo)

    // 메모히스토리에 추가 디바운스: 0.5초
    clearTimeout(debounceTimeoutId.current)
    debounceTimeoutId.current = setTimeout(async () => {
      pushHistory(newText)
    }, 1000 * 0.5)

    clearTimeout(fetchTimeoutId.current)
    fetchTimeoutId.current = setTimeout(async () => {
      if (isLogin) {
        try {
          await memoApi.patchMemo(newMemo)
          invalidateQuery({ queryFn: memoApi.getAllMemo })

          addSnackBar('수정완료')
        } catch (error) {
          console.error('메모 수정 실패:', error)
        }
      }
    }, 1000 * 1.5)
  }

  function clickMemo(memoId: number) {
    if (readOnly) {
      router.push(`/memo?memoId=${memoId}`)
    }
  }

  function handleDeleteMemo(e: MouseEvent<SVGSVGElement>) {
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
        onClick: async () => {
          closeModal()
          if (isLogin) {
            try {
              await memoApi.deleteMemo(memoId)
              addSnackBar('메모 삭제 성공')
              invalidateQuery({ queryFn: memoApi.getAllMemo })
              if (!readOnly) router.replace(routes.root)
            } catch (err) {
              addSnackBar(`메모 삭제 실패: <br/>${JSON.stringify(err)}`)
            }
          } else {
            deleteMemo(memoId)
          }
        },
      },
    ])
  }

  const memoTime = currentMemo
    ? dayjs(currentMemo.editedAt || currentMemo.createdAt).format(
        'YYYY-MM-DD HH:mm'
      )
    : ''
  return (
    <>
      <StyledMemo
        onClick={() => clickMemo(memoId)}
        readOnly={readOnly}
        fetching={fetching}
      >
        <StyledMemoHeader>
          {memoTime}
          <StyledClearIcon onClick={handleDeleteMemo} />
        </StyledMemoHeader>

        <StyledTextarea
          value={memoText}
          onChange={setMemoAndPushHistory}
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
  ${({ readOnly }) =>
    readOnly &&
    `cursor: pointer;
    overflow: hidden;`}
`
