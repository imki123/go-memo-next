import { QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner'

import { BE_URL, userApi } from '@/apis/userApi'
import { queryClient } from '@/lib/queryClient'
import GlobalStyle from '@/styles/GlobalStyle'
import '@/styles/globals.css'
import { initGoogle } from '@/utils/googleLogin'

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

  function afterLogin() {
    userApi
      .checkLogin()
      .then((res) => {
        if (res) {
          toast.success('로그인 성공 😄')
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

      <Component {...pageProps} />

      <Toaster position='bottom-center' richColors />

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
