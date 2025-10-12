import { QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'

import { BE_URL, userApi } from '@/apis/userApi'
import { PasswordScreen } from '@/components/PasswordScreen'
import { SplashScreen } from '@/feature/home/SplashScreen'
import { queryClient } from '@/lib/queryClient'
import GlobalStyle from '@/styles/GlobalStyle'
import '@/styles/globals.css'
import { initGoogle } from '@/utils/googleLogin'
import { usePasswordScreenStore } from '@/zustand/usePasswordScreenStore'
import { useSplashStore } from '@/zustand/useSplashStore'

import { routes } from '.'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  // 테마 지정
  const router = useRouter()

  useEffect(() => {
    console.info('[ENV]', process.env.NODE_ENV, BE_URL)
    console.info('[hash]', process.env.NEXT_PUBLIC_GIT_COMMIT_HASH)
  }, [])

  useEffect(() => {
    console.info('[MyApp]', router.pathname)
  }, [router.pathname])

  const { splashVisible, setSplashVisible } = useSplashStore()
  const { passwordScreenOpened, isLocked, setIsLocked } =
    usePasswordScreenStore()

  const [splashOpened, setSplashOpened] = useState(true)
  const initialTimeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // NOTE: 스플래시 노출
    if (splashVisible === undefined) {
      setSplashVisible(true)
      initialTimeoutId.current = setTimeout(
        () => setSplashVisible(false),
        1 * 1000
      )
    }
    if (splashVisible === false) {
      setTimeout(() => setSplashOpened(false), 300)
    }
  }, [splashVisible, setSplashVisible])

  useEffect(() => {
    // NOTE: 언마운트시 타임아웃 제거
    return () => {
      clearTimeout(initialTimeoutId.current)
    }
  }, [])

  function afterLogin() {
    userApi
      .checkLogin()
      .then((loginData) => {
        if (loginData) {
          toast.success('로그인 성공 😄')

          if (loginData.locked && (isLocked || isLocked === undefined)) {
            setIsLocked(true)
          }

          router.replace(routes.root)
        } else {
          toast.error('로그인 실패 😥')
        }
      })
      .catch((err) => {
        toast.error('로그인 실패 😥<br/>' + JSON.stringify(err))
      })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />

      <Script
        src='https://accounts.google.com/gsi/client'
        onLoad={() => initGoogle(userApi.login, afterLogin)}
      ></Script>

      <Head>
        <title>고영이메모장🐈</title>
        <meta name='description' content='next.js로 만들어진 간단한 메모장' />
        <meta
          // 키보드가 올라올 때 UI 자동 조정
          name='viewport'
          content='width=device-width, initial-scale=1.0, interactive-widget=resizes-content'
        />
        <link rel='shortcut icon' href='/go-memo-next/favicon.ico' />
        <link rel='manifest' href='/go-memo-next/manifest.json' />
      </Head>

      {splashOpened && <SplashScreen visible={splashVisible} />}

      {passwordScreenOpened && <PasswordScreen />}

      <Component {...pageProps} />

      <Toaster
        position='top-right'
        richColors
        offset={0}
        style={{
          maxWidth: '60vw',
          right: 0,
          left: 'auto',
        }}
      />

      <a
        href='https://github.com/imki123'
        target='_blank'
        className='fixed bottom-1 right-1 text-xs font-bold no-underline text-black cursor-pointer flex items-end'
      >
        <Image
          unoptimized={true} // 외부 url
          alt='github'
          src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          width={16}
          height={16}
          style={{ borderRadius: '50%' }}
        />
        imki123
      </a>
    </QueryClientProvider>
  )
}

export default MyApp
