import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import Splash from '../component/layout/Splash'
import { useThemeStore } from '../zustand'

export default function IndexPage() {
  const router = useRouter()
  const [visibleSplash, setVisibleSplash] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout>()

  const { theme } = useThemeStore()

  // 2초 동안 스플래시 보이고, 0.3초 후 home으로 이동
  useEffect(() => {
    setVisibleSplash(true)
    timeoutId.current = setTimeout(() => {
      setVisibleSplash(false)
      setTimeout(() => {
        router.replace(routes.home) // home으로 이동
      }, 300)
    }, 1000 * 2)
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [router])

  return (
    <div>
      <Splash visible={visibleSplash} theme={theme} />
    </div>
  )
}

export const routes = {
  root: '/',
  home: '/home',
  login: '/login',
  memo: '/memo',
}
