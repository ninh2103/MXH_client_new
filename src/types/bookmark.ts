import { z } from 'zod'

export const BookmarkTypeSchema = z.object({
  tweet_id: z.string()
})

// Định nghĩa schema cho PostResponse
const BookmarkResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    _id: z.string(),
    tweet_id: z.string(),
    user_id: z.string(),
    creater_at: z.string().datetime() // Định dạng ISO 8601 cho ngày tháng
  })
})

// Bạn có thể xuất các schema để sử dụng ở các nơi khác trong dự án của bạn
export type BookmarkBodyType = z.infer<typeof BookmarkTypeSchema>
export type ResponseBookmark = z.infer<typeof BookmarkResponseSchema>