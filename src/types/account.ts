import { boolean, z } from 'zod'

export interface AccountType {
  _id: string
  name: string
  email: string
  data_of_birth: string
  create_at: string
  update_at: string
  avatar: string
  bio: string
  cover_photo: string
  location: string
  tweet_circle: Array<{
    id: string
    imageUrl?: string
    title?: string
  }>
  username: string
  verify: number
  website: string
}

export type UserType = {
  avatar: string
  name: string
  email: string
  _id: string
  date_of_birth: string
  create_at: string
  update_at: string
  tweet_circle: unknown[]
  verify: number
  bio: string
  location: string
  website: string
  username: string
  cover_photo: string
} | null

// Define the structure for the response payload
export interface GetMeResponse {
  message: string
  result: AccountType
}

export const UpdateMeReqBody = z.object({
  name: z.string().optional(),
  data_of_birth: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  username: z.string().optional(),
  avatar: z.string().optional(),
  cover_photo: z.string().optional()
})

export type UpdateMeReqBodyType = z.infer<typeof UpdateMeReqBody>

export const GetUserListSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  data_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  create_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  update_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  tweet_circle: z.array(z.unknown()),
  verify: z.number(),
  bio: z.string(),
  location: z.string(),
  website: z.string(),
  username: z.string(),
  avatar: z.string(),
  cover_photo: z.string()
})

export const UserListResponseSchema = z.object({
  message: z.string(),
  result: z.array(GetUserListSchema)
})

export type GetListReponse = z.infer<typeof UserListResponseSchema>

const FollowerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  username: z.string(),
  avatar: z.string().url()
})

const GetFollowerListSchema = z.object({
  message: z.string(),
  result: z.array(FollowerSchema)
})
export type GetFollowerReponse = z.infer<typeof GetFollowerListSchema>

const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  username: z.string(),
  avatar: z.string().url()
})

// Định nghĩa kiểu cho phản hồi tổng thể
const GetUserSearchResponseSchema = z.object({
  message: z.string(),
  results: z.array(UserSchema)
})
export type GetSearchUsersReponse = z.infer<typeof GetUserSearchResponseSchema>
