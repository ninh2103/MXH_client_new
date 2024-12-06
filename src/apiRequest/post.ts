import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { GetDetailResponse, GetMyPostsResponse, GetNewFeedsResponse, PostResponse, PostType } from '@/types/post'

const postApiRequest = {
  createPost: async (body: PostType, access_token: string): Promise<PostResponse> => {
    const response = await http.post<PostResponse>('/tweets', body, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  }
}

export default postApiRequest

export const getNewFeed = async (limit: number, page: number): Promise<GetNewFeedsResponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/tweets?limit=${limit}&page=${page}`

  const response = await http.get<GetNewFeedsResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
export const getMyPosts = async (): Promise<GetMyPostsResponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }
  const response = await http.get<GetMyPostsResponse>('/tweets/newfeed/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
export const getNewFeedRandom = async (limit: number, page: number): Promise<GetNewFeedsResponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/tweets/newfeed/random?limit=${limit}&page=${page}`

  const response = await http.get<GetNewFeedsResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
export const getTweetDetail = async (tweet_id: string) => {
  const url = `/tweets/${tweet_id}`

  const response = await http.get<GetDetailResponse>(url)

  return response.payload
}
export const getUserPosts = async (profile_user_id: string): Promise<GetMyPostsResponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }
  const url = `/tweets/newfeed/user/${profile_user_id}`
  const response = await http.get<GetMyPostsResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
// export const postApi = {
//   list: (limit: number, page: number) =>
//     http.get<GetNewFeedsResponse>(`/tweets/dashboard/list/?limit=${limit}&page=${page}`),
//   deletePost: (id: string) => http.delete<GetNewFeedsResponse>(`/users/${id}`),
//   listVideo: (limit: number, page: number) =>
//     http.get<GetNewFeedsResponse>(`/tweets/video/newfeed/random/?limit=${limit}&page=${page}`)
// }

export const listVideo = async (limit: number, page: number) => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/tweets/video/newfeed/random/?limit=${limit}&page=${page}`

  const response = await http.get<GetNewFeedsResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.payload
}

export const list = async (limit: number, page: number) => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/tweets/dashboard/list/?limit=${limit}&page=${page}`

  const response = await http.get<GetNewFeedsResponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.payload
}
export const deletePost = async (id: string) => {
  const url = `/tweets/${id}`
  const access_token = getAccessTokenFromLocalStorage()
  const response = await http.delete<GetNewFeedsResponse>(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
  return response.payload
}
