import styled from '@emotion/styled'
import OpenColor from 'open-color'
import { ReactNode } from 'react'

export type ButtonModelType = {
  onClick?: () => void
  children?: ReactNode
  type?: 'Primary' | 'Circle'
}

// 기본 버튼 컴포넌트
function Button({ onClick, children, type }: ButtonModelType) {
  // style
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
    // 타입 구분
    ${type === 'Circle' &&
    `background-color: white;
      color: black;
      border-radius: 100%;
      border: 1px solid gray;
      optcity: 0.5;
      width: 32px;
      height: 32px;
      padding: 0;
    `}
  `

  return <StyledButton onClick={onClick}>{children}</StyledButton>
}

export default Button
