import styled from '@emotion/styled'
import oc from 'open-color'

export default function Splash() {
  return <SplashWrapper>잔짜잔! 고영이 메모장입니다. 🐱</SplashWrapper>
}

const SplashWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: ${oc.blue[0]};
  font-size: 20px;
`
