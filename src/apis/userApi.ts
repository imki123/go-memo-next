import { AxiosError } from 'axios'

import { axiosClient } from './axios'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL
const baseUrl = '/memo/user'

const urls = {
  root: `${baseUrl}/`,
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  checkLogin: `${baseUrl}/checkLogin`,
  setLock: `${baseUrl}/setLock`,
  unlock: `${baseUrl}/unlock`,
  removeLock: `${baseUrl}/removeLock`,
}

export type LoginResponseType = {
  email: string
  sub: string
  name?: string
  picture?: string
  locked?: boolean
  token?: string
}

export const userApi = {
  async login(credential: string): Promise<LoginResponseType> {
    const res = await axiosClient.post(urls.login, { credential })
    const data = res.data as LoginResponseType
    return data
  },

  async logout() {
    const res = await axiosClient.post(urls.logout)
    return res.data
  },

  async checkLogin(): Promise<LoginResponseType> {
    try {
      const res = await axiosClient.post(urls.checkLogin)
      const data = res.data as LoginResponseType
      return data
    } catch (error) {
      const axiosError = error as AxiosError<LoginResponseType>
      if (axiosError.response?.status === 401) {
        return { email: '', sub: '', token: '' }
      }
      throw error
    }
  },

  async setLock(password: string) {
    const res = await axiosClient.post(urls.setLock, { password })
    return res.data
  },

  async unlock(password: string) {
    const res = await axiosClient.post(urls.unlock, { password })
    return res.data
  },

  async removeLock() {
    const res = await axiosClient.post(urls.removeLock)
    return res.data
  },
}
