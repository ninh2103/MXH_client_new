import z from 'zod'

const UploadResult = z.object({
  url: z.string(),
  type: z.number()
})

export const UploadImageRes = z.object({
  result: z.array(UploadResult)
})

export type UploadImageResType = z.infer<typeof UploadImageRes>

const UploadVideoResult = z.object({
  url: z.string(),
  type: z.number()
})

export const UploadVideoRes = z.object({
  result: UploadVideoResult
})

export type UploadVideoResType = z.infer<typeof UploadVideoRes>
