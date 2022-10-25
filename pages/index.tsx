import Head from 'next/head'
import Splash from '../component/Splash'
import { useEffect, useRef, useState } from 'react'
import GlobalStyle from '../styles/GlobalStyle'
import MemoGrid from '../component/MemoGrid'

export default function Home() {
  const [visibleSplash, setVisibleSplash] = useState(true)
  const [removeSplash, setRemoveSplash] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout>()

  // 2초 동안 스플래시 보이고, 0.3초 후 스플래시 제거
  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      setVisibleSplash(false)
      setTimeout(() => {
        setRemoveSplash(true)
      }, 300)
    }, 1000 * 2)
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])

  return (
    <div>
      <Head>
        <title>고영이메모장</title>
        <meta name='description' content='next.js로 만들어진 간단한 메모장' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GlobalStyle />
      {!removeSplash && <Splash visible={visibleSplash} />}
      <MemoGrid />
    </div>
  )
}
