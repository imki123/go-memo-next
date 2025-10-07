import axios from 'axios'

import { MemoType } from '../components/molecules/Memo'

import { BE_URL } from './user'

const axiosWithCredentials = axios.create({
  baseURL: BE_URL + '/memo/memo',
  withCredentials: true,
})

const urls = {
  root: '/',
  allIds: '/allIds',
}

export const getAllIds = () =>
  axiosWithCredentials
    .get<{ memoId: number }[]>(`${urls.allIds}`)
    .then((res) => res.data)

export const getAllMemo = () => {
  return axiosWithCredentials
    .get<MemoType[]>(`${urls.root}`)
    .then((res) => res.data)
}

export const getMemo = (memoId: number) => {
  return axiosWithCredentials
    .get<MemoType>(`${urls.root}${memoId}`)
    .then((res) => res.data)
}

export const postMemo = () => {
  return axiosWithCredentials.post<MemoType>(urls.root).then((res) => res.data)
}

export const patchMemo = (memo: MemoType) => {
  return axiosWithCredentials
    .patch<MemoType>(urls.root, {
      memo,
    })
    .then((res) => res.data)
}

export const deleteMemo = (memoId: number) => {
  return axiosWithCredentials
    .delete<MemoType>(`${urls.root}${memoId}`)
    .then((res) => res.data)
}
