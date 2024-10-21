import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import {
  LoginBody,
  LoginResType,
  LogoutBody,
  LogoutResType,
  RegisterBodyType,
  ResponseResType,
  VerifyBodyType,
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
