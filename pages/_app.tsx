import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import { BE_URL } from '@/apis/userApi'
import { AuthAutoLoginController } from '@/app/providers/AuthAutoLoginController'
import { LockScreenController } from '@/app/providers/LockScreenController'
import { ServerHealthCheckController } from '@/app/providers/ServerHealthCheckController'
import '@/app/styles/globals.css'
import GlobalStyle from '@/app/styles/GlobalStyle'
import { queryClient } from '@/infra/query/queryClient'

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

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />

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

      <AuthAutoLoginController />

      <LockScreenController />

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

          <ServerHealthCheckController />

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
