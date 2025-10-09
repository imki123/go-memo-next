import { axiosWithCredentials } from './axios'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL
const baseUrl = '/memo/user'

const urls = {
  root: `${baseUrl}/`,
  login: `${baseUrl}/login`,
  logout: `${baseUrl}/logout`,
  checkLogin: `${baseUrl}/checkLogin`,
}

export const userApi = {
  async login(credential: string, afterLogin?: () => void) {
    const res = await axiosWithCredentials.post(urls.login, { credential })
    const data = res.data as LoginResponseType
    afterLogin?.()
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
}

export type LoginResponseType = {
  email: string
  sub: string
  name?: string
  picture?: string
}
