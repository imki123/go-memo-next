import 'pretendard/dist/web/variable/pretendardvariable.css'

import { useEffect } from 'react'

import { localStorageKeys } from '@/utils/localStorageKeys'
import { useThemeStore } from '@/zustand/useThemeStore'

// 헤더 높이
export const HEADER_HEIGHT = 60
// 최대 너비
export const MAX_WIDTH = 800

export default function GlobalStyle() {
  // 로컬 테마
  const { theme: storeTheme, setState: setStoreTheme } = useThemeStore()

  // meta theme-color 변경하는 함수
  function setMetaThemeColor(color: string) {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.querySelector('meta[name=theme-color]')?.remove()
    document.head?.appendChild(meta)
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem(
      localStorageKeys.memoTheme
    ) as 'dark' | undefined
    setStoreTheme(localTheme)
    setMetaThemeColor(localTheme === 'dark' ? '#111827' : 'white')
  }, [setStoreTheme])

  useEffect(() => {
    setMetaThemeColor(storeTheme === 'dark' ? '#111827' : 'white')
    
    // 다크 테마 클래스 적용
    if (storeTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [storeTheme])

  return null
}
