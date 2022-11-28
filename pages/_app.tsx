import type { AppProps } from 'next/app'
import GlobalStyle from '../styles/GlobalStyle'
import styled from '@emotion/styled'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import Head from 'next/head'
import { initGoogle } from '../util/googleLogin'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../queryClient'
import { BE_URL, checkLogin, login } from './../api/user'
import useModal from '../hook/useModal'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    console.info('>>> ENV:', process.env.NODE_ENV, BE_URL)
  }, [])

  useEffect(() => {
    console.info('>>> MyApp:', router.pathname)
  }, [router.pathname])

  const { openModal, closeModal, Modal, setTitle } = useModal()
  const [clickModal, setClickModal] = useState(() => {
    return () => {}
  })

  // 로그인 로직
  const afterLogin = () => {
    checkLogin()
      .then((res) => {
        openModal()
        if (res) {
          setTitle('로그인 성공 😄')
          setClickModal(() => {
            return () => {
              router.replace('/home')
              closeModal()
            }
          })
        } else {
          setTitle('로그인 실패 😥')
          setClickModal(closeModal)
        }
      })
      .catch((err) => {
        openModal()
        setTitle('로그인 실패 😥\n' + JSON.stringify(err))
        setClickModal(closeModal)
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
      <Modal buttons={[{ text: '확인', onClick: clickModal }]} />
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
