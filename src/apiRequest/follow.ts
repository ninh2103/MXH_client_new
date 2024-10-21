import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { FollowBodyType, ResponseFollow } from '@/types/follow'

const followApiRequest = {
  follow: async (body: FollowBodyType, access_token: string) => {
    const response = await http.post<ResponseFollow>('/users/follow', body, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  },
  unfollow: async (user_id: string) => {
    const url = `users/unfollow/${user_id}`
    const access_token = getAccessTokenFromLocalStorage()
    const response = await http.delete<ResponseFollow>(url, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  }
}
export default followApiRequest
