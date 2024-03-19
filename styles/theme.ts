import '@emotion/react'

type ThemeType = {
  theme: 'dark' | null
}

// emotion Theme 오버라이드
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ThemeType {}
}
