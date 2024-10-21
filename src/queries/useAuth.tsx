import { login, logout, register, verifyEmail } from '@/apiRequest/auth'
import { useMutation } from '@tanstack/react-query'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login
  })
}
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register
  })
}
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout
  })
}
export const useVerifyMutation = () => {
  return useMutation({
    mutationFn: verifyEmail
  })
}
