import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { ping } from '@/apis/pingApi'

export function ServerHealthCheckController() {
  const hasRequestedPing = useRef(false)

  useEffect(() => {
    if (hasRequestedPing.current) {
      return
    }

    hasRequestedPing.current = true

    void ping().catch(() => {
      toast.error('서버 연결에 실패했습니다. 다시 시도해주세요.')
    })
  }, [])

  return null
}
