import styled from '@emotion/styled'
import { useRouter } from 'next/router'

export default function NotFound404() {
  const router = useRouter()
  // asPath가 루트이면 basePath로 이동(/go-memo-next)
  if (router.asPath === '/') router.push('/')

  return <CenterDiv>404 | Not Found Page.</CenterDiv>
}

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 20px;
`
