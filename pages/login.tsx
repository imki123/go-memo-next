import styled from '@emotion/styled'
import { useEffect } from 'react'
import Header from '../component/Header'
import { renderGoogleButton } from '../util/googleLogin'

export default function LoginPage() {
  useEffect(() => {
    renderGoogleButton('googleLoginDiv')
  }, [])

  return (
    <LoginPageWrapper>
      <Header title='고영이 메모장 🐈' backButton={true} />
      <div id='googleLoginDiv'></div>
    </LoginPageWrapper>
  )
}

const LoginPageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`
