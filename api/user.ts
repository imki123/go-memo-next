import Axios from 'axios'

export const BE_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.NEXT_PUBLIC_LOCAL_BE_PORT || 4001}`
    : process.env.NEXT_PUBLIC_BE_URL

export const axiosWithCredentials = Axios.create({
  baseURL: BE_URL + '/memo/user',
  withCredentials: true,
})

const urls = {
  root: '/',
  login: '/login',
  checkLogin: '/checkLogin',
}

export const login = (credential: string) => {
  return axiosWithCredentials
    .post(urls.login, { credential })
    .then((res) => res.data)
}

export const checkLogin = () => {
  return axiosWithCredentials.post(urls.checkLogin).then((res) => res.data)
}
