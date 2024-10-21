import { z } from 'zod'

export type ConversationType = {
  _id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  updated_at: string
}

export type ResultType = {
  limit: number
  page: number
  total_page: number
  conversations: ConversationType[]
}

export type ApiResponseType = {
  result: ResultType
  message: string
}
export const conversationSchema = z.object({
  _id: z.string(),
  sender_id: z.string(),
  receiver_id: z.string(),
  content: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export const resultSchema = z.object({
  limit: z.number(),
  page: z.number(),
  total_page: z.number(),
  conversations: z.array(conversationSchema)
})

export const apiResponseSchema = z.object({
  result: resultSchema,
  message: z.string()
})

export type getReceiverReponse = z.infer<typeof apiResponseSchema>
