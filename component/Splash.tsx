import OpenColor from 'open-color'
import styled from '@emotion/styled'

export default function Splash({ visible }: { visible: boolean }) {
  return (
    <SplashWrapper visible={visible}>잔짜잔! 고영이 메모장 🐈</SplashWrapper>
  )
}

const SplashWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
`
