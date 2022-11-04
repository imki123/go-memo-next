import styled from '@emotion/styled'
import { useEffect } from 'react'
import { renderGoogleButton } from '../util/googleLogin'

export default function LoginPage() {
  useEffect(() => {
    renderGoogleButton('googleLoginDiv')
  }, [])

  return (
    <LoginPageWrapper>
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
