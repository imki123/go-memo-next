import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { checkLogin, loginResponseType } from '../apis/user'
import { queryKeys } from '../queryClient'

export const useGetCheckLogin = (
  options?: UseQueryOptions<loginResponseType>
) => useQuery<loginResponseType>(queryKeys.checkLogin, checkLogin, options)
