'use client'
import { useEffect } from 'react'
import { useVerifyMutation } from '@/queries/useAuth'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const verifyMutation = useVerifyMutation()
  const router = useRouter() // Khởi tạo useRouter

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const email_verify_token = params.get('token')

    if (email_verify_token) {
      verifyMutation.mutate(
        { email_verify_token },
        {
          onSuccess: () => {
            // Chuyển hướng về trang login sau 5 giây
            setTimeout(() => {
              router.push('/login')
            }, 5000)
          },
          onError: (error) => {
            console.error('Error verifying email:', error)
            // Bạn có thể xử lý lỗi ở đây nếu cần
          }
        }
      )
    }
  }, [verifyMutation, router]) // Đảm bảo router cũng nằm trong dependency array

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-5xl'>Verify Email</div>
    </div>
  )
}
