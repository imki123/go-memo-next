import styled from '@emotion/styled'
import OpenColor from 'open-color'

export default function Splash({ visible }: { visible?: boolean }) {
  return <StyledSplash visible={visible}>잔짜잔! 고영이 메모장🐈</StyledSplash>
}

const StyledSplash = styled.div<{ visible?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${OpenColor.blue[2]};
  font-size: 20px;
  transition: opacity 0.3s;
  z-index: 9999;
  ${({ visible }) =>
    visible
      ? `
          opacity: 1;
        `
      : `
          opacity: 0;
        `}
  ${({ theme }) =>
    theme.theme === 'dark' && `background: ${OpenColor.gray[7]};`}
`
