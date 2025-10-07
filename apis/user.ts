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

export const login = (credential: string, afterLogin?: () => void) => {
  return axiosWithCredentials
    .post(urls.login, { credential })
    .then((res) => {
      return res.data as loginResponseType
    })
    .then(() => {
      afterLogin?.()
    })
}

export const logout = () => {
  return axiosWithCredentials.post(urls.logout).then((res) => res.data)
}

export const checkLogin = () => {
  return axiosWithCredentials
    .post(urls.checkLogin)
    .then((res) => res.data as loginResponseType)
}

export type loginResponseType = {
  email: string
  sub: string
  name?: string
  picture?: string
}
