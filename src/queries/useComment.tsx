import commentApiRequest from '@/apiRequest/comment'
import { CommentBodyType, ResponseComment, ResponseGetComment } from '@/types/comment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<ResponseComment, unknown, { body: CommentBodyType; access_token: string }>({
    mutationFn: ({ body, access_token }) => commentApiRequest.comment(body, access_token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comment']
      })
    }
  })
}
export const useGetCommentQuery = (tweet_id: string, limit: number, page: number) => {
  return useQuery<ResponseGetComment>({
    queryKey: ['getComment'],
    queryFn: () => commentApiRequest.getComment(tweet_id, limit, page)
  })
}
