import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { BookmarkBodyType, ResponseBookmark } from '@/types/bookmark'

const bookmarkApiRequest = {
  bookmark: async (body: BookmarkBodyType, access_token: string) => {
    const response = await http.post<ResponseBookmark>('/bookmarks/', body, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  },
  unBookmark: async (tweet_id: string) => {
    const url = `bookmarks/tweets/${tweet_id}`
    const access_token = getAccessTokenFromLocalStorage()
    const response = await http.delete<ResponseBookmark>(url, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.payload
  }
}
export default bookmarkApiRequest
