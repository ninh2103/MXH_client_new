import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import {
  GetFollowerReponse,
  GetListReponse,
  GetMeResponse,
  GetSearchUsersReponse,
  UpdateMeReqBodyType
} from '@/types/account'

export const getMe = async (): Promise<GetMeResponse> => {
  const accessToken = getAccessTokenFromLocalStorage()
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const response = await http.get<GetMeResponse>('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.payload
}

export const accountApiRequest = {
  update: (data: UpdateMeReqBodyType, access_token: string) =>
    http.put('/users/me', data, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
}

export const getUserList = async (limit: number, page: number): Promise<GetListReponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/users/list/tofollow?limit=${limit}&page=${page}`

  const response = await http.get<GetListReponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}

export const getProfile = async (user_id: string) => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }
  const url = `/users/${user_id}`
  const response = await http.get<GetMeResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
export const getUserMessageList = async (limit: number, page: number): Promise<GetListReponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/users/message/list?limit=${limit}&page=${page}`

  const response = await http.get<GetListReponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
export const getFollower = async () => {
  const accessToken = getAccessTokenFromLocalStorage()
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const response = await http.get<GetFollowerReponse>('/users/follower/list', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.payload
}
export const getFollowing = async () => {
  const accessToken = getAccessTokenFromLocalStorage()
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const response = await http.get<GetFollowerReponse>('/users/following/list', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.payload
}
export const getUserSearchList = async (searchTerm: string, limit: number = 10) => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  // Tạo URL với từ khóa tìm kiếm và limit
  const url = `/users/api/search?name=${encodeURIComponent(searchTerm)}&limit=${limit}`

  const response = await http.get<GetSearchUsersReponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
