export const isClient = typeof window !== 'undefined'
export const zIndex = {
  passwordScreen: 'z-[100]',
  commonModal: 'z-[1000]',
  splashScreen: 'z-[10000]',
} as const
