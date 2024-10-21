import z from 'zod'

const UploadResult = z.object({
  url: z.string(),
  type: z.number()
})

export const UploadImageRes = z.object({
  result: z.array(UploadResult)
})

export type UploadImageResType = z.infer<typeof UploadImageRes>
