import followApiRequest from '@/apiRequest/follow'
import { FollowBodyType, ResponseFollow } from '@/types/follow'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useFollowMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<ResponseFollow, unknown, { body: FollowBodyType; access_token: string }>({
    mutationFn: ({ body, access_token }) => followApiRequest.follow(body, access_token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['follow']
      })
    }
  })
}

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: followApiRequest.unfollow,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unfollow']
      })
    }
  })
}
