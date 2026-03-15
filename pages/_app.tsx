import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

import { BE_URL, LoginResponseType } from '@/apis/userApi'
import { authService } from '@/domain/auth/di'
import { useLockStore } from '@/infra/store/lockStore'
import { queryClient } from '@/lib/queryClient'
import { LockInitializer } from '@/providers/LockInitializer'
import GlobalStyle from '@/styles/GlobalStyle'
import '@/styles/globals.css'

import { routes } from '.'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // NOTE: 앱 시작시 설정 정보 표시
    console.info(
      '[buildTime, commitHash, env]',
      process.env.NEXT_PUBLIC_BUILD_TIME,
      process.env.NEXT_PUBLIC_GIT_COMMIT_HASH,
      process.env.NODE_ENV,
      BE_URL
    )
  }, [])

  useEffect(() => {
    // NOTE: 라우트 변경시 표시
    console.info('[MyApp]', router.pathname)
  }, [router.pathname])

  function afterLogin(loginData: LoginResponseType) {
    if (loginData.token) {
      toast.success('로그인 성공 😄')
      useLockStore.getState().setIsLockedLocal(false)
      router.replace(routes.root)
    } else {
      toast.error('로그인 실패 😥')
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />

      <Script
        src='https://accounts.google.com/gsi/client'
        onLoad={() => authService.autoLogin(afterLogin)}
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

      <LockInitializer />

      <Component {...pageProps} />

      {mounted && (
        <>
          <Toaster
            position='bottom-center'
            richColors
            style={{
              maxWidth: '70vw',
            }}
          />

          <a
            href='https://github.com/imki123'
            target='_blank'
            rel='noopener noreferrer'
            className='fixed bottom-1 right-1 text-xs font-bold no-underline text-black cursor-pointer flex items-end'
          >
            <Image
              unoptimized={true}
              alt='github'
              src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
              width={16}
              height={16}
              style={{ borderRadius: '50%' }}
            />
            imki123
          </a>
        </>
      )}
    </QueryClientProvider>
  )
}

export default MyApp
