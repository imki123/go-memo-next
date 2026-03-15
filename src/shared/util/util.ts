import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isClient = typeof window !== 'undefined'
export const zIndex = {
  lockScreen: 'z-[100]',
  commonModal: 'z-[1000]',
} as const
