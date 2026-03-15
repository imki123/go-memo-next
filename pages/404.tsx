import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { routePaths } from '@/app/routePaths'

export default function NotFound404() {
  const router = useRouter()
  // asPath가 루트이면 basePath로 이동(/go-memo-next)

  useEffect(() => {
    if (router.asPath === '/') router.push(routePaths.root)
    else {
      console.info('404')
      router.replace(routePaths.root)
    }
  }, [router])

  return (
    <div className='flex flex-col gap-5 justify-center items-center fixed top-0 bottom-0 left-0 right-0 text-xl'>
      <div>404 | Not Found Page.</div>
      <Link href={routePaths.root} replace>
        Go home
      </Link>
    </div>
  )
}
