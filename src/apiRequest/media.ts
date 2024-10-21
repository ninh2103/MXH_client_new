import http from '@/lib/http'
import { UploadImageResType } from '@/types/media'

export const upload = async (formData: FormData): Promise<UploadImageResType> => {
  const response = await http.post<UploadImageResType>('/medias/upload-image', formData)
  console.log('API Response:', response.payload)
  return response.payload
}
