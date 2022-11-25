import type { AppProps } from 'next/app'
import GlobalStyle from '../styles/GlobalStyle'
import styled from '@emotion/styled'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import Head from 'next/head'
import { initGoogle } from '../util/googleLogin'
import { login } from '../api'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    console.info('>>> MyApp:', router.pathname)
  }, [router.pathname])

  return (
    <>
      <GlobalStyle />
      <Script
        src='https://accounts.google.com/gsi/client'
        onLoad={() => initGoogle(login)}
      ></Script>
      <Head>
        <title>고영이메모장🐈</title>
        <meta name='description' content='next.js로 만들어진 간단한 메모장' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Component {...pageProps} />

      <Copyright href='https://github.com/imki123' target='_blank'>
        <Image
          alt='github'
          src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          width={16}
          height={16}
          style={{ borderRadius: '50%' }}
        />
        imki123
      </Copyright>
    </>
  )
}

export default MyApp

const Copyright = styled.a`
  position: fixed;
  bottom: 4px;
  right: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-decoration: none;
  color: black;
  cursor: pointer;

  display: flex;
  align-items: flex-end;
`
