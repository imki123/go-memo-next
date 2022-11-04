import Head from 'next/head'
import Splash from '../component/Splash'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const router = useRouter()
  const [visibleSplash, setVisibleSplash] = useState(true)
  const timeoutId = useRef<NodeJS.Timeout>()

  // 2초 동안 스플래시 보이고, 0.3초 후 스플래시 제거
  useEffect(() => {
    timeoutId.current = setTimeout(() => {
      setVisibleSplash(false)
      setTimeout(() => {
        router.replace('/home') // home으로 이동
      }, 300)
    }, 1000 * 2)
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [router])

  return (
    <div>
      <Head>
        <title>고영이메모장🐈</title>
        <meta name='description' content='next.js로 만들어진 간단한 메모장' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Splash visible={visibleSplash} />
    </div>
  )
}
