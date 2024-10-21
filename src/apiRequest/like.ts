import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { LikeBodyType, ResponseLike } from '@/types/like'

const likeApiRequest = {
  like: async (body: LikeBodyType, access_token: string) => {
    const response = await http.post<ResponseLike>('/likes/', body, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  },
  unlike: async (tweet_id: string) => {
    const url = `likes/tweets/${tweet_id}`
    const access_token = getAccessTokenFromLocalStorage()
    const response = await http.delete<ResponseLike>(url, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  }
}
export default likeApiRequest
