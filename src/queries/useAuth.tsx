import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
  verifyEmailPassword
} from '@/apiRequest/auth'
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

export const useVerifyPasswordMutation = () => {
  return useMutation({
    mutationFn: verifyEmailPassword
  })
}
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword
  })
}

export const useResetMutation = () => {
  return useMutation({
    mutationFn: resetPassword
  })
}
