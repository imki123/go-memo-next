import { MemoType } from '@/components/home/Memo'

import { axiosClient } from './axios'
const baseUrl = '/memo/memos'

const urls = {
  root: `${baseUrl}/`,
  allIds: `${baseUrl}/allIds`,
}

export const memoApi = {
  async getAllIds() {
    const res = await axiosClient.get<{ memoId: number }[]>(`${urls.allIds}`)
    return res.data
  },

  async getAllMemo() {
    const res = await axiosClient.get<MemoResponse[]>(`${urls.root}`)
    return res.data
  },

  async getMemo(memoId: number) {
    if (memoId <= 0) {
      return undefined
    }

    const res = await axiosClient.get<MemoResponse>(`${urls.root}${memoId}`)
    return res.data
  },

  async postMemo() {
    const res = await axiosClient.post<MemoResponse>(urls.root)
    return res.data
  },

  async patchMemo(memo: MemoType) {
    const res = await axiosClient.patch<MemoResponse>(urls.root, {
      memo,
    })
    return res.data
  },

  async deleteMemo(memoId: number) {
    const res = await axiosClient.delete<MemoResponse>(`${urls.root}${memoId}`)
    return res.data
  },
}

export type MemoResponse = {
  _id: string
  memoId: number
  email: string
  sub: string
  text?: string
  createdAt?: string
  editedAt?: string
}
