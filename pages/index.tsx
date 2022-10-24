import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import Splash from '../component/splash'
import { useEffect, useRef, useState } from 'react'
import GlobalStyle from '../styles/GlobalStyle'

export default function Home() {
  const [isSplash, setIsSplash] = useState(true)
  const timeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      setIsSplash(false)
    }, 1000 * 2)
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])

  return (
    <div>
      <Head>
        <title>고영이메모장</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GlobalStyle />
      {isSplash ? <Splash /> : <main>Hello world!</main>}
    </div>
  )
}

const StyledLink = styled(Link)`
  color: red;
  background: white;
  text-decoration: underline;
`
