import 'pretendard/dist/web/variable/pretendardvariable.css'

import { useEffect } from 'react'

import { localStorageKeys } from '@/utils/localStorageKeys'
import { ThemeType, useThemeStore } from '@/zustand/useThemeStore'

// 헤더 높이
export const HEADER_HEIGHT = 60
// 최대 너비
export const MAX_WIDTH = 800

export default function GlobalStyle() {
  // 로컬 테마
  const { setTheme } = useThemeStore()

  useEffect(() => {
    const localTheme = window.localStorage.getItem(
      localStorageKeys.memoTheme
    ) as ThemeType

    setTheme(localTheme)
  }, [setTheme])

  return null
}
