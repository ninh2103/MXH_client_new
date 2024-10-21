import bookmarkApiRequest from '@/apiRequest/bookmark'
import { BookmarkBodyType, ResponseBookmark } from '@/types/bookmark'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useBookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<ResponseBookmark, unknown, { body: BookmarkBodyType; access_token: string }>({
    mutationFn: ({ body, access_token }) => bookmarkApiRequest.bookmark(body, access_token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookmark']
      })
    }
  })
}

export const useUnBookmarkMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bookmarkApiRequest.unBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['unbookmark']
      })
    }
  })
}
