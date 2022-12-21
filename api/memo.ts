import axios from 'axios'

import { MemoModel } from '../component/molecule/Memo'

import { BE_URL } from './user'

const axiosWithCredentials = axios.create({
  baseURL: BE_URL + '/memo/memo',
  withCredentials: true,
})

const urls = {
  root: '/',
}

export const getAllMemo = () => {
  return axiosWithCredentials
    .get<MemoModel[]>(`${urls.root}`)
    .then((res) => res.data)
}

export const getMemo = (memoId: number) => {
  return axiosWithCredentials
    .get<MemoModel>(`${urls.root}${memoId}`)
    .then((res) => res.data)
}

export const postMemo = () => {
  return axiosWithCredentials.post<MemoModel>(urls.root).then((res) => res.data)
}

export const patchMemo = (memo: MemoModel) => {
  return axiosWithCredentials
    .patch<MemoModel>(urls.root, {
      memo,
    })
    .then((res) => res.data)
}

export const deleteMemo = (memoId: number) => {
  return axiosWithCredentials
    .delete<MemoModel>(`${urls.root}${memoId}`)
    .then((res) => res.data)
}
