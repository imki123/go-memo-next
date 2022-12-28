import styled from '@emotion/styled'
import { QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'

import { queryClient } from '../queryClient'
import GlobalStyle from '../styles/GlobalStyle'
import { initGoogle } from '../util/googleLogin'
import { addSnackBar } from '../util/util'

import { BE_URL, checkLogin, login } from './../api/user'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    console.info('>>> ENV:', process.env.NODE_ENV, BE_URL)
  }, [])

  useEffect(() => {
    console.info('>>> MyApp:', router.pathname)
  }, [router.pathname])

  // 로그인 로직
  const afterLogin = () => {
    checkLogin()
      .then((res) => {
        if (res) {
          addSnackBar('로그인 성공 😄')
          router.replace('/home')
        } else {
          addSnackBar('로그인 실패 😥')
        }
      })
      .catch((err) => {
        addSnackBar('로그인 실패 😥<br/>' + JSON.stringify(err))
      })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Script
        src='https://accounts.google.com/gsi/client'
        onLoad={() => initGoogle(login, afterLogin)}
      ></Script>
      <Head>
        <title>고영이메모장🐈</title>
        <meta name='description' content='next.js로 만들어진 간단한 메모장' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>

      <Component {...pageProps} />

      <Copyright href='https://github.com/imki123' target='_blank'>
        <Image
          unoptimized={true} // 외부 url
          alt='github'
          src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          width={16}
          height={16}
          style={{ borderRadius: '50%' }}
        />
        imki123
      </Copyright>
    </QueryClientProvider>
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
