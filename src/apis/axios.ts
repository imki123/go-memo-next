import axios from 'axios'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export const axiosWithCredentials = axios.create({
  baseURL: BE_URL,
  withCredentials: true,
  timeout: 1000 * 60 * 5, // 5분
})
