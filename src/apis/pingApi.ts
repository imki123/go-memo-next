import { axiosClient } from './axios'

export async function ping(): Promise<void> {
  await axiosClient.get<void>('/ping')
}
