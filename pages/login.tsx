import styled from '@emotion/styled'
import { useEffect } from 'react'

import Header from '../component/molecule/Header'
import { renderGoogleButton } from '../util/googleLogin'

export default function LoginPage() {
  useEffect(() => {
    renderGoogleButton('googleLoginDiv')
  }, [])

  return (
    <>
      <Header title='고영이 메모장🐈' backButton={true} rightItems={[]} />
      <LoginPageWrapper>
        <div id='googleLoginDiv'></div>
        <br />
        <InfoDiv>
          쿠키 사용이 차단 되어있는 경우 로그인이 불가합니다.
          <br />
          <span>크롬</span> 또는 <span>사파리</span> 브라우저를 사용해주세요. 😉
        </InfoDiv>
      </LoginPageWrapper>
    </>
  )
}

const LoginPageWrapper = styled.div`
  margin-top: 200px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const InfoDiv = styled.div`
  padding: 40px;
  font-size: 12px;
  span {
    font: inherit;
    color: blue;
  }
`
