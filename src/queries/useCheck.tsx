import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'

const useCheck = () => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()

    if (!accessToken) {
      // Nếu không có token và không ở trang login, chuyển hướng tới trang login
      if (pathname !== '/login') {
        router.push('/login')
      }
    } else {
      // Nếu đã có token và đang ở trang login, chuyển hướng tới trang chủ
      if (pathname === '/login') {
        router.push('/')
      }
    }
  }, [pathname])
}

export default useCheck
