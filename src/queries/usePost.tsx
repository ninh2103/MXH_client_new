import postApiRequest, {
  getMyPosts,
  getNewFeed,
  getNewFeedRandom,
  getTweetDetail,
  getUserPosts
} from '@/apiRequest/post'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { GetDetailResponse, GetMyPostsResponse, GetNewFeedsResponse, PostResponse, PostType } from '@/types/post'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostResponse, unknown, { body: PostType; access_token: string }>({
    mutationFn: ({ body, access_token }) => postApiRequest.createPost(body, access_token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['post']
      })
    }
  })
}

export const useNewFeedtQuery = (limit: number, page: number) => {
  return useQuery<GetNewFeedsResponse>({
    queryKey: ['newfeed', limit, page], // Thêm limit và page vào queryKey
    queryFn: () => getNewFeed(limit, page) // Truyền limit và page vào hàm getNewFeed
  })
}
export const useNewFeedRandomtQuery = (limit: number, page: number) => {
  return useQuery<GetNewFeedsResponse>({
    queryKey: ['random', limit, page], // Thêm limit và page vào queryKey
    queryFn: () => getNewFeedRandom(limit, page) // Truyền limit và page vào hàm getNewFeed
  })
}
export const useNewFeedMetQuery = () => {
  return useQuery<GetMyPostsResponse>({
    queryKey: ['my-post'],
    queryFn: () => getMyPosts()
  })
}
export const useUserPostMetQuery = (profile_user_id: string) => {
  return useQuery<GetMyPostsResponse>({
    queryKey: ['user-post'],
    queryFn: () => getUserPosts(profile_user_id)
  })
}
export const useGetDetailQuery = (tweet_id: string) => {
  return useQuery<GetDetailResponse>({
    queryKey: ['detail'],
    queryFn: () => getTweetDetail(tweet_id)
  })
}
