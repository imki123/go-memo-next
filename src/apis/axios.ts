import axios from 'axios'

import { accessTokenRepository } from '@/infra/auth/accessTokenRepository'

export const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export const axiosClient = axios.create({
  baseURL: BE_URL,
  timeout: 1000 * 60 * 5, // 5분
})

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = accessTokenRepository.getAccessToken()
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
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
