import { useEffect } from 'react'

import { useThemeStore } from '@/zustand/useThemeStore'

import 'pretendard/dist/web/variable/pretendardvariable.css'

// 헤더 높이
export const HEADER_HEIGHT = 60
// 최대 너비
export const MAX_WIDTH = 800

export default function GlobalStyle() {
  const { theme, setDocumentTheme } = useThemeStore()

  useEffect(() => {
    // NOTE: theme 변경시 document에 적용
    setDocumentTheme(theme)
  }, [setDocumentTheme, theme])

  return null
}
