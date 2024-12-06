import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import {
  ForgotPasswordBody,
  ForgotPasswordResType,
  LoginBody,
  LoginResType,
  LogoutBody,
  LogoutResType,
  RegisterBodyType,
  ResetPassword,
  ResponseResType,
  VerifyBodyType,
  VerifyPasswordBodyType,
  VerifyResType
} from '@/types/auth'

export const login = async (body: LoginBody) => {
  const response = await http.post<LoginResType>('users/login', body)
  return response.payload
}
export const logout = async (body: LogoutBody) => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }
  const response = await http.post<LogoutResType>('users/logout', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.payload
}
export const register = async (body: RegisterBodyType) => {
  const response = await http.post<ResponseResType>('users/register', body)
  return response.payload
}
export const verifyEmail = async (body: VerifyBodyType) => {
  const response = await http.post<VerifyResType>('users/verify-email', body)
  return response.payload
}

export const verifyEmailPassword = async (body: VerifyPasswordBodyType) => {
  const response = await http.post<VerifyResType>('/users/verify-forgot-password-token', body)
  return response.payload
}

export const forgotPassword = async (body: ForgotPasswordBody) => {
  const response = await http.post<ForgotPasswordResType>('/users/forgot-password', body)
  return response.payload
}

export const resetPassword = async (body: ResetPassword) => {
  const response = await http.post<ForgotPasswordResType>('/users/reset-password', body)
  return response.payload
}
