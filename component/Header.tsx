import React, { ReactNode } from 'react'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Avatar from './Avatar'
import Link from 'next/link'
import OpenColor from 'open-color'
import { checkLogin } from '../api/user'
import { queryKeys } from '../queryClient'
import styled from '@emotion/styled'
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
  const right = rightItems || [
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
    <HeaderWrapper>
      <HeaderFixed>
        <LeftItems>
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
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  height: 40px;
`
const HeaderFixed = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-weight: bold;
`
const LeftItems = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const RightItems = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
