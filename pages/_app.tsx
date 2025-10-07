import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useState } from 'react'

import { BE_URL, userApi } from '../apis/userApi'
import { queryClient } from '../queryClient'
import GlobalStyle from '../styles/GlobalStyle'
import '../styles/globals.css'
import { initGoogle } from '../utils/googleLogin'
import { addSnackBar } from '../utils/util'
import { useThemeStore } from '../zustand/useThemeStore'

import { routes } from '.'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  // 테마 지정
  const router = useRouter()

  useEffect(() => {
    console.info('>>> ENV:', process.env.NODE_ENV, BE_URL)
    console.info('>>> hash:', process.env.NEXT_PUBLIC_GIT_COMMIT_HASH)
  }, [])

  useEffect(() => {
    console.info('>>> MyApp:', router.pathname)
  }, [router.pathname])

  // 로그인 로직
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const afterLogin = () => {
    setIsLoggingIn(true)

    userApi
      .checkLogin()
      .then((res) => {
        if (res) {
          addSnackBar('로그인 성공 😄')
          router.replace(routes.root)
        } else {
          addSnackBar('로그인 실패 😥')
        }
      })
      .catch((err) => {
        addSnackBar('로그인 실패 😥<br/>' + JSON.stringify(err))
      })
      .finally(() => {
        setIsLoggingIn(false)
      })
  }

  const { theme: theme } = useThemeStore()

  useEffect(() => {
    const updateHeight = () => {
      if (window.visualViewport) {
        document.documentElement.style.height = `${window.visualViewport.height}px`
        document.body.style.height = `${window.visualViewport.height}px`
      }
    }

    updateHeight() // 초기 실행
    window.visualViewport?.addEventListener('resize', updateHeight)
    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight)
      document.documentElement.style.height = ''
      document.body.style.height = ''
    }
  }, [])

  return (
    <ThemeProvider theme={{ theme: theme }}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <Script
          src='https://accounts.google.com/gsi/client'
          onLoad={() => initGoogle(userApi.login, afterLogin)}
        ></Script>
        <Head>
          <title>고영이메모장🐈</title>
          <meta name='description' content='next.js로 만들어진 간단한 메모장' />
          <link rel='shortcut icon' href='/go-memo-next/favicon.ico' />
          <link rel='manifest' href='/go-memo-next/manifest.json' />
        </Head>

        {isLoggingIn && (
          <div>
            로그인 중... 서버가 재시작될 경우 최대 5분정도 소요될 수 있습니다.
          </div>
        )}

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
    </ThemeProvider>
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
