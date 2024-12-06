'use client'
import { Input } from '@/components/ui/input'
import { useForgotPasswordMutation } from '@/queries/useAuth'
import { ForgotPasswordBody } from '@/types/auth'
import React, { useState } from 'react'

export default function Forgotpassword() {
  const [email, setEmail] = useState('')
  const forgotPasswordMutation = useForgotPasswordMutation()

  const handleSubmit = async (body: ForgotPasswordBody) => {
    const data = await forgotPasswordMutation.mutateAsync(body)
    console.log(data)
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='mb-4 text-xl font-semibold text-white'>Quên mật khẩu</h2>
      <p className='mb-6 text-sm text-gray-600'>Vui lòng nhập email để lấy lại mật khẩu</p>
      <div className='flex flex-col gap-4'>
        <Input
          id='email'
          type='email'
          placeholder='Nhập email của bạn'
          className='border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          value={email} // Lưu trữ giá trị nhập vào
          onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị khi thay đổi
        />
        <button
          type='button' // Change this to 'button' instead of 'submit' to avoid form submission behavior
          className='w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300'
          onClick={() => handleSubmit({ email })} // Pass the email inside the body object
        >
          Gửi yêu cầu
        </button>
      </div>
    </div>
  )
}
