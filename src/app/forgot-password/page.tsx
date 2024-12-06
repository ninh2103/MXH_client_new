'use client'

import { useState, useEffect } from 'react'
import { useResetMutation } from '@/queries/useAuth'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [token, setToken] = useState<string | null>(null) // State để lưu token
  const resetPasswordMutation = useResetMutation()
  const router = useRouter()

  useEffect(() => {
    // Đảm bảo chỉ chạy trên client-side
    if (typeof window !== 'undefined') {
      const urlToken = new URLSearchParams(window.location.search).get('token')
      setToken(urlToken) // Lưu token vào state
    }
  }, [])

  const handleSubmit = () => {
    if (!token) {
      console.error('Token không tồn tại!')
      return
    }

    if (password === confirmPassword) {
      resetPasswordMutation.mutate(
        {
          password,
          comfirm_password: confirmPassword,
          forgot_password_token: token
        },
        {
          onSuccess: () => {
            router.push('/login')
          },
          onError: (error) => {
            console.error('Reset failed:', error)
          }
        }
      )
    } else {
      setIsPasswordValid(false)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col items-center p-4 border rounded-lg shadow-lg'>
        <h2 className='mb-4 text-xl text-white font-semibold'>Đặt lại mật khẩu</h2>
        <input
          type='password'
          placeholder='Nhập mật khẩu mới'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-2 p-2 border border-gray-300 rounded-lg'
        />
        <input
          type='password'
          placeholder='Nhập lại mật khẩu'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded-lg'
        />
        {!isPasswordValid && <p className='text-red-500 text-sm'>Mật khẩu không khớp!</p>}
        <button
          type='button'
          onClick={handleSubmit}
          className='py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
        >
          Đặt lại mật khẩu
        </button>
      </div>
    </div>
  )
}
