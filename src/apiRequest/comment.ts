import http from '@/lib/http'
import { CommentBodyType, ResponseComment, ResponseGetComment } from '@/types/comment'
import { ResponseLike } from '@/types/like'

const commentApiRequest = {
  comment: async (body: CommentBodyType, access_token: string) => {
    const response = await http.post<ResponseComment>('/comments/', body, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  },
  getComment: async (tweet_id: string, limit: number, page: number) => {
    const url = `/comments/${tweet_id}?limit=${limit}&page=${page}`
    const response = await http.get<ResponseGetComment>(url)
    return response.payload
  }
}
export default commentApiRequest
