import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import Splash from '../component/layout/Splash'

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
      <Splash visible={visibleSplash} />
    </div>
  )
}
