import { BE_URL, checkLogin, login } from './../api/user'

import type { AppProps } from 'next/app'
import GlobalStyle from '../styles/GlobalStyle'
import Head from 'next/head'
import Image from 'next/image'
import { QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'
import { dummyMemos } from '../api/dummyMemos'
import { initGoogle } from '../util/googleLogin'
import { queryClient } from '../queryClient'
import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useMemoStore } from '../zustand'
import useModal from '../hook/useModal'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const globalStore = useMemoStore()
  const { setMemos } = globalStore
  const { openModal, closeModal, Modal, setTitle, setButtons } = useModal()

  const modalButtons = (onClick = closeModal) => [
    { text: '확인', onClick: onClick },
  ]

  // 로그인 안되어있으면 더미메모 저장
  useEffect(() => {
    checkLogin()
      .then((res) => {
        if (!res) {
          setMemos(dummyMemos)
        }
      })
      .catch((err) => {
        setMemos(dummyMemos)
        setTitle(
          <div>
            서버 오류가 발생했습니다.😥
            <br />
            관리자에게 문의 바랍니다.
            <br />
            <br />
            {JSON.stringify(err)}
          </div>
        )
        setButtons([])
        openModal()
      })
  }, [openModal, setButtons, setMemos, setTitle])

  // 글로벌 스토어 로깅
  useEffect(() => {
    console.info('globalStore:', globalStore)
  }, [globalStore])

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
        openModal()
        if (res) {
          setTitle('로그인 성공 😄')
          setButtons(
            modalButtons(() => {
              router.replace('/home')
              closeModal()
            })
          )
        } else {
          setTitle('로그인 실패 😥')
          setButtons(modalButtons())
        }
      })
      .catch((err) => {
        openModal()
        setTitle('로그인 실패 😥\n' + JSON.stringify(err))
        setButtons(modalButtons())
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
          alt='github'
          src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          width={16}
          height={16}
          style={{ borderRadius: '50%' }}
        />
        imki123
      </Copyright>
      <Modal />
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
