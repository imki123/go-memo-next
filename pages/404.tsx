import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function NotFound404() {
  const router = useRouter()
  // asPath가 루트이면 basePath로 이동(/go-memo-next)

  useEffect(() => {
    if (router.asPath === '/') router.push('/')
    else {
      console.info('404 page!')
      router.replace('/home')
    }
  }, [router])

  return (
    <CenterDiv>
      <div>404 | Not Found Page.</div>
      <div>Redirecting home...</div>
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
