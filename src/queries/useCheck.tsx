import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { decodeToken, getAccessTokenFromLocalStorage } from '@/lib/utils'

export default function useCheck(requiredRole: number) {
  const router = useRouter()

  useEffect(() => {
    const token = getAccessTokenFromLocalStorage()

    // Nếu không có token, chuyển hướng đến login
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decodedToken: { role: number } = decodeToken(token)

      // Nếu vai trò không khớp, điều hướng đến trang phù hợp
      if (decodedToken.role !== requiredRole) {
        if (decodedToken.role === 1) {
          // Admin không được truy cập các trang của user
          router.push('/manage/accounts')
        } else if (decodedToken.role === 0) {
          // User không được truy cập các trang của admin
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Lỗi khi decode token:', error)
      // Nếu token không hợp lệ, chuyển hướng đến login
      router.push('/login')
    }
  }, [router, requiredRole])
}
