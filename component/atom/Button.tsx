import styled from '@emotion/styled'
import OpenColor from 'open-color'
import { ReactNode } from 'react'

// 기본 버튼 컴포넌트
const Button = ({
  onClick,
  children,
}: {
  onClick?: () => void
  children?: ReactNode
}) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>
}

export default Button

const StyledButton = styled.button`
  cursor: pointer;
  flex-shrink: 0;
  height: 32px;
  padding: 0 15px;
  border-radius: 4px;
  border: 0;
  outline: 0;
  background-color: ${OpenColor.indigo[8]};
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: white;
`
