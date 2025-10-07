import axios from 'axios'

import { MemoType } from '../components/molecules/Memo'

import { BE_URL } from './userApi'

const axiosWithCredentials = axios.create({
  baseURL: BE_URL + '/memo/memo',
  withCredentials: true,
})

const urls = {
  root: '/',
  allIds: '/allIds',
}

export const memoApi = {
  async getAllIds() {
    const res = await axiosWithCredentials.get<{ memoId: number }[]>(
      `${urls.allIds}`
    )
    return res.data
  },

  async getAllMemo() {
    const res = await axiosWithCredentials.get<MemoType[]>(`${urls.root}`)
    return res.data
  },

  async getMemo(memoId: number) {
    if (memoId <= 0) {
      return undefined
    }

    const res = await axiosWithCredentials.get<MemoType>(
      `${urls.root}${memoId}`
    )
    return res.data
  },

  async postMemo() {
    const res = await axiosWithCredentials.post<MemoType>(urls.root)
    return res.data
  },

  async patchMemo(memo: MemoType) {
    const res = await axiosWithCredentials.patch<MemoType>(urls.root, {
      memo,
    })
    return res.data
  },

  async deleteMemo(memoId: number) {
    const res = await axiosWithCredentials.delete<MemoType>(
      `${urls.root}${memoId}`
    )
    return res.data
  },
}
