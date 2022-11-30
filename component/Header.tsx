import React, { ReactNode } from 'react'
import { headerHeight, noSelect } from '../styles/GlobalStyle'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Avatar from './Avatar'
import Link from 'next/link'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import OpenColor from 'open-color'
import { checkLogin } from '../api/user'
import { queryKeys } from '../queryClient'
import styled from '@emotion/styled'
import useModal from '../hook/useModal'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

interface HeaderModel {
  title?: string | number
  backButton?: boolean
  rightItems?: ReactNode[]
}
export default function Header({
  title,
  backButton = true,
  rightItems,
}: HeaderModel) {
  const router = useRouter()
  const { data: isLogin } = useQuery(queryKeys.checkLogin, checkLogin)
  const { openModal, Modal, setTitle } = useModal()
  const right = rightItems || [
    <StyledLockOpenIcon
      onClick={() => {
        openModal()
        setTitle('잠금화면 준비중입니다 😄')
      }}
    />,
    isLogin ? (
      <Avatar avatar={isLogin} />
    ) : (
      <LinkWrapper>
        <Link href='/login' key='login'>
          로그인
        </Link>
      </LinkWrapper>
    ),
  ]

  return (
    <>
      <HeaderPadding />
      <HeaderFixed>
        <LeftItems onClick={() => window.scrollTo(0, 0)}>
          {backButton && (
            <StyledArrowBackIosNewIcon
              fontSize='inherit'
              onClick={router.back}
            />
          )}
          {title}
        </LeftItems>
        <RightItems>
          {React.Children.toArray(right?.map((item) => item))}
        </RightItems>
      </HeaderFixed>
      <Modal />
    </>
  )
}

const HeaderPadding = styled.div`
  height: ${headerHeight}px;
`
const HeaderFixed = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  height: ${headerHeight}px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-weight: bold;
  background: white;
`
const LeftItems = styled.div`
  ${noSelect}
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`
const RightItems = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
const StyledArrowBackIosNewIcon = styled(ArrowBackIosNewIcon)`
  :hover {
    cursor: pointer;
  }
`
export const LinkWrapper = styled.span`
  a {
    color: ${OpenColor.indigo[6]};
    text-decoration: none;
    font: inherit;
    font-size: 14px;
  }
`

export const StyledLockOpenIcon = styled(LockOpenIcon)`
  cursor: pointer;
`
