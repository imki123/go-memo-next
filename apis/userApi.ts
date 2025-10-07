import axios from 'axios'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export const axiosWithCredentials = axios.create({
  baseURL: BE_URL + '/memo/user',
  withCredentials: true,
})

const urls = {
  root: '/',
  login: '/login',
  logout: '/logout',
  checkLogin: '/checkLogin',
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
