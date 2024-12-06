import http from '@/lib/http'
import { UploadImageResType, UploadVideoResType } from '@/types/media'

export const upload = async (formData: FormData): Promise<UploadImageResType> => {
  const response = await http.post<UploadImageResType>('/medias/upload-image', formData)
  return response.payload
}

export const uploadVideo = async (formData: FormData): Promise<UploadVideoResType> => {
  const response = await http.post<UploadVideoResType>('/medias/upload-video', formData)
  return response.payload
}
