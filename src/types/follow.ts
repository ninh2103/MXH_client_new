import { z } from 'zod'

export const FollowTypeSchema = z.object({
  followed_user_id: z.string()
})

// Định nghĩa schema cho PostResponse
export const FollowResponseSchema = z.object({
  message: z.string()
})

// Bạn có thể xuất các schema để sử dụng ở các nơi khác trong dự án của bạn
export type FollowBodyType = z.infer<typeof FollowTypeSchema>
export type ResponseFollow = z.infer<typeof FollowResponseSchema>
