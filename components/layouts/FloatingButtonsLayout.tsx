import styled from '@emotion/styled'
import { ReactNode } from 'react'

import { MAX_WIDTH, mediaBiggerThan } from '../../styles/GlobalStyle'

/**
 * FloatingButtonsLayout 컴포넌트
 * // TODO: 엘리먼트 각각에 bottom 을 줄 수 있도록 수정 필요
 * // 이름도 Bottom이 들어가도록 수정 필요
 * @params
 */
const FloatingButtonsLayout = ({ children }: { children: ReactNode }) => {
  return <StyledFloatingButtonsLayout>{children}</StyledFloatingButtonsLayout>
}

export default FloatingButtonsLayout

const StyledFloatingButtonsLayout = styled.div`
  position: fixed;
  margin: 0 auto;
  bottom: 30px;
  right: 30px;
  ${mediaBiggerThan(
    MAX_WIDTH,
    `
      right: calc(50% - 400px + 40px);
      transform: translateX(-50%);
    `
  )}

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`
