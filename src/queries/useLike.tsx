import likeApiRequest from '@/apiRequest/like'
import { LikeBodyType, ResponseLike } from '@/types/like'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const uselikeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<ResponseLike, unknown, { body: LikeBodyType; access_token: string }>({
    mutationFn: ({ body, access_token }) => likeApiRequest.like(body, access_token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['like']
      })
    }
  })
}

export const useUnLikeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: likeApiRequest.unlike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unlike']
      })
    }
  })
}
