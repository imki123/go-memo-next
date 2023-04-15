import styled from '@emotion/styled'
import OpenColor from 'open-color'

export default function Splash({
  visible,
  theme,
}: {
  visible?: boolean
  theme?: 'dark'
}) {
  return (
    <SplashWrapper visible={visible} theme={theme}>
      잔짜잔! 고영이 메모장🐈
    </SplashWrapper>
  )
}

const SplashWrapper = styled.div<{ visible?: boolean; theme?: 'dark' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 100%;
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
  ${({ theme }) => theme === 'dark' && `background: ${OpenColor.gray[7]};`}
`
