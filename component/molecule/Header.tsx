import styled from '@emotion/styled'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import OpenColor from 'open-color'
import React, { ReactNode } from 'react'

import { checkLogin } from '../../api/user'
import useModal from '../../hook/useModal'
import { queryKeys } from '../../queryClient'
import { HEADER_HEIGHT, MAX_WIDTH, noSelect } from '../../styles/GlobalStyle'
import { useThemeStore } from '../../zustand'

import Avatar from './Avatar'

interface HeaderModel {
  fixed?: boolean
  title?: string | number
  backButton?: boolean
  rightItems?: ReactNode[]
}
export default function Header({
  fixed = true,
  title,
  backButton = true,
  rightItems,
}: HeaderModel) {
  // 테마 지정
  const { theme, set: setTheme } = useThemeStore()

  const router = useRouter()
  const { data: isLogin } = useQuery(queryKeys.checkLogin, checkLogin)
  const { openModal, Modal, setTitle } = useModal()
  const right = rightItems || [
    <>
      {theme === 'dark' ? (
        <DarkModeIcon
          fontSize='small'
          onClick={() => {
            setTheme(undefined)
            window.localStorage.removeItem('go-memo-next-theme')
          }}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <LightModeIcon
          fontSize='small'
          onClick={() => {
            setTheme('dark')
            window.localStorage.setItem('go-memo-next-theme', 'dark')
          }}
          style={{ cursor: 'pointer' }}
        />
      )}
    </>,
    <StyledLockOpenIcon
      onClick={() => {
        openModal()
        setTitle('준비중입니다 😄')
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
      {fixed && <HeaderPadding />}
      <HeaderFixed fixed={fixed}>
        <HeaderWrapper theme={theme}>
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
        </HeaderWrapper>
      </HeaderFixed>
      <Modal />
    </>
  )
}

const HeaderPadding = styled.div`
  height: ${HEADER_HEIGHT}px;
`
const HeaderFixed = styled.div<{ fixed?: boolean }>`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
`
const HeaderWrapper = styled.div<{ fixed?: boolean; theme?: 'dark' }>`
  height: calc(100% - 4px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-weight: bold;
  box-shadow: 0 1px 5px rgba(57, 63, 72, 0.3);
  background: white;
  ${({ fixed }) => !fixed && `position: relative;`}
  ${({ theme }) => theme === 'dark' && `background: ${OpenColor.gray[9]};`}
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
