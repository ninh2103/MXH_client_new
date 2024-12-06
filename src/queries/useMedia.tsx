import { useMutation } from '@tanstack/react-query'
import { upload, uploadVideo } from '@/apiRequest/media'
import { UploadImageResType } from '@/types/media'

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await upload(formData)
      console.log('Upload response:', response)
      return response
    }
  })
}

export const useUploadVideoMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await uploadVideo(formData)
      return response
    }
  })
}
