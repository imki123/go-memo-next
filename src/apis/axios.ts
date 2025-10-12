import axios from 'axios'

import { localStorageKeys } from '@/utils/localStorageKeys'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export const axiosWithCredentials = axios.create({
  baseURL: BE_URL,
  timeout: 1000 * 60 * 5, // 5분
})

// 요청 인터셉터: Authorization 헤더 추가
axiosWithCredentials.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(localStorageKeys.memoAuthToken)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 401 에러 시 로그아웃 처리
axiosWithCredentials.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
