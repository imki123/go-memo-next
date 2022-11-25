import Axios from 'axios'

export const axiosWithCredentials = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL + '/memo',
})

const urls = {
  root: '/',
  login: '/login',
}

export const login = (jwt: string) => {
  return axiosWithCredentials.post(urls.login, { jwt }).then((res) => res.data)
}
