import { useLoginStore } from '@/zustand/useLoginStore'

import { axiosWithCredentials } from './axios'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL
const baseUrl = '/memo/user'

const urls = {
  root: `${baseUrl}/`,
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  checkLogin: `${baseUrl}/checkLogin`,
  setLock: `${baseUrl}/setLock`,
  unlock: `${baseUrl}/unlock`,
}

export const userApi = {
  async login(credential: string, afterLogin?: () => void) {
    useLoginStore.getState().setIsLoggingIn(true)
    useLoginStore.getState().setSecondsToLogin(0)

    const loginIntervalId = setInterval(() => {
      useLoginStore
        .getState()
        .setSecondsToLogin(useLoginStore.getState().secondsToLogin + 1)
    }, 1000)

    useLoginStore.getState().setLoginIntervalId(loginIntervalId)

    const res = await axiosWithCredentials
      .post(urls.login, { credential })
      .finally(() => {
        clearInterval(loginIntervalId)
        useLoginStore.getState().setLoginIntervalId(undefined)
        useLoginStore.getState().setSecondsToLogin(0)
        useLoginStore.getState().setIsLoggingIn(false)
      })

    afterLogin?.()

    const data = res.data as LoginResponseType
    return data
  },

  async logout() {
    const res = await axiosWithCredentials.post(urls.logout)
    return res.data
  },

  async checkLogin() {
    const res = await axiosWithCredentials.post(urls.checkLogin)
    return res.data as LoginResponseType
  },

  async setLock(password: string) {
    const res = await axiosWithCredentials.post(urls.setLock, { password })
    return res.data
  },

  async unlock(password: string) {
    const res = await axiosWithCredentials.post(urls.unlock, { password })
    return res.data
  },
}

export type LoginResponseType = {
  email: string
  sub: string
  name?: string
  picture?: string
  locked?: boolean
}
