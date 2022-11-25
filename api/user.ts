import Axios from 'axios'

export const BE_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.NEXT_PUBLIC_LOCAL_BE_PORT || 4001}`
    : process.env.NEXT_PUBLIC_BE_URL

export const axiosWithCredentials = Axios.create({
  baseURL: BE_URL + '/memo/user',
})

const urls = {
  root: '/',
  login: '/login',
}

export const login = (jwt: string) => {
  return axiosWithCredentials.post(urls.login, { jwt }).then((res) => res.data)
}
