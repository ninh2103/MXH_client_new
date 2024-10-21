import { z } from 'zod'

const MediaSchema = z.object({
  url: z.string(),
  type: z.number().int().nonnegative()
})
const MentionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string()
})

export const PostTypeSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  type: z.number().int().nonnegative(), // Assumes non-negative integers
  audience: z.number().int().nonnegative(), // Assumes non-negative integers
  content: z.string(),
  parent_id: z.string().nullable(), // Nullable if it's null
  hashtags: z.array(z.string()), // Array of strings
  mentions: z.array(z.string()), // Array of strings
  medias: z.array(MediaSchema), // Array of media objects
  guest_view: z.number().int().nonnegative(), // Assumes non-negative integers
  user_view: z.number().int().nonnegative(), // Assumes non-negative integers
  created_at: z.string(), // Consider using z.coerce.date() for date parsing
  updated_at: z.string() // Consider using z.coerce.date() for date parsing
})

// Định nghĩa schema cho PostResponse
export const PostResponseSchema = z.object({
  message: z.string(),
  result: PostTypeSchema,
  status: z.number() // Referencing the PostType schema
})

// Bạn có thể xuất các schema để sử dụng ở các nơi khác trong dự án của bạn
export type PostType = z.infer<typeof PostTypeSchema>
export type PostResponse = z.infer<typeof PostResponseSchema>

const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  create_at: z.string(),
  update_at: z.string(),
  verify: z.number(),
  bio: z.string(),
  location: z.string(),
  website: z.string(),
  username: z.string(),
  avatar: z.string(),
  cover_photo: z.string()
})

// Schema cho Tweet
const TweetSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  type: z.number(),
  audience: z.number(),
  content: z.string(),
  parent_id: z.string().nullable(),
  hashtags: z.array(z.string()),
  isLiked: z.boolean(),
  isBookmarked: z.boolean(),
  mentions: z.array(MentionSchema),
  medias: z.array(MediaSchema),
  guest_view: z.number(),
  user_view: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  debugMatch: z.object({
    _id: z.string(),
    user_id: z.string(),
    type: z.number(),
    audience: z.number(),
    content: z.string(),
    parent_id: z.string().nullable(),
    hashtags: z.array(z.string()),
    mentions: z.array(MentionSchema),
    medias: z.array(MediaSchema),
    guest_view: z.number(),
    user_view: z.number(),
    created_at: z.string(),
    updated_at: z.string()
  }), // Schema đệ quy nếu cần
  user: UserSchema,
  debugAudience: z.number(),
  bookmarks: z.number(),
  likes: z.number(),
  retweet_count: z.number(),
  comment_count: z.number(),
  quote_count: z.number()
})

// Schema cho phản hồi API
export const ApiResponseSchema = z.object({
  message: z.string(),
  result: z.array(TweetSchema)
})

const ResultSchema = z.object({
  posts: z.array(TweetSchema),
  followingCount: z.number(),
  followersCount: z.number(),
  postCount: z.number()
})

const ApiMeResponseSchema = z.object({
  message: z.string(),
  result: ResultSchema
})

// Tạo kiểu cho phản hồi GetNewFeeds
export type GetNewFeedsResponse = z.infer<typeof ApiResponseSchema>
export type GetMyPostsResponse = z.infer<typeof ApiMeResponseSchema>

const tweetDetailResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    _id: z.string(),
    user_id: z.string(),
    type: z.number(),
    audience: z.number(),
    content: z.string(),
    parent_id: z.string().nullable(),
    hashtags: z.array(z.string()),
    mentions: z.array(MentionSchema),
    medias: z.array(MediaSchema),
    guest_view: z.number(),
    user_view: z.number(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    view: z.number(),
    likes: z.number(),
    isLike: z.boolean(),
    isBookmark: z.boolean()
  })
})

export type GetDetailResponse = z.infer<typeof tweetDetailResponseSchema>
