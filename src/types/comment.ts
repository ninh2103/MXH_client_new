import { z } from 'zod'

// Định nghĩa schema cho CommentType
export const CommentTypeSchema = z.object({
  tweet_id: z.string(),
  parent_id: z.union([z.string(), z.null()]), // Có thể null nếu là bình luận gốc
  content: z.string()
})

// Định nghĩa schema cho phản hồi từ API khi tạo comment
const CommentResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    _id: z.string(),
    tweet_id: z.string(),
    user_id: z.string(),
    parent_id: z.union([z.string(), z.null()]), // Có thể null
    content: z.string(),
    created_at: z.string().datetime() // Đảm bảo 'created_at' là kiểu ngày giờ
  })
})

// Định nghĩa schema cho chi tiết của User
const UserDetailsSchema = z.object({
  name: z.string(),
  username: z.string(),
  avatar: z.string().url() // Đảm bảo avatar là một URL hợp lệ
})

// Định nghĩa schema cho các replies của comment
const CommentRepliesSchema = z.object({
  _id: z.string(),
  tweet_id: z.string(),
  parent_id: z.union([z.string(), z.null()]), // Có thể null nếu không phải reply
  user_id: z.string(),
  content: z.string(),
  created_at: z.string().datetime(), // Đảm bảo định dạng ngày giờ
  userDetails: UserDetailsSchema // Thêm userDetails vào replies
})

// Định nghĩa schema cho comment chính
const CommentSchema = z.object({
  _id: z.string(),
  content: z.string(),
  parent_id: z.union([z.string(), z.null()]), // Có thể null nếu là bình luận gốc
  created_at: z.string().datetime(), // Định dạng ngày giờ
  userDetails: UserDetailsSchema, // Thông tin chi tiết user
  replies: z.array(CommentRepliesSchema) // Mảng các replies
})

// Định nghĩa schema cho kết quả trả về từ API khi lấy danh sách comments
const GetCommentResponseSchema = z.object({
  message: z.string(),
  result: z.array(CommentSchema) // Mảng các bình luận, bao gồm replies
})

// Xuất các loại đã xác định
export type CommentBodyType = z.infer<typeof CommentTypeSchema>
export type ResponseComment = z.infer<typeof CommentResponseSchema>
export type ResponseGetComment = z.infer<typeof GetCommentResponseSchema>
