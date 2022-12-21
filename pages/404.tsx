import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function NotFound404() {
  const router = useRouter()
  // asPath가 루트이면 basePath로 이동(/go-memo-next)
  if (router.asPath === '/') router.push('/')

  return (
    <CenterDiv>
      <div>404 | Not Found Page.</div>
      <Link href={'/home'}>홈으로</Link>
    </CenterDiv>
  )
}

const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 20px;
`
