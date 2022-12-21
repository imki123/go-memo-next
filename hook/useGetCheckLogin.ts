import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { checkLogin, loginResponse } from '../api/user'
import { queryKeys } from '../queryClient'

export const useGetCheckLogin = (options?: UseQueryOptions<loginResponse>) =>
  useQuery<loginResponse>(queryKeys.checkLogin, checkLogin, options)
