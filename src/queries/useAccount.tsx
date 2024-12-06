import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  accountApiRequest,
  deleteAccount,
  getFollower,
  getFollowing,
  getMe,
  getProfile,
  getUserList,
  getUserMessageList,
  getUserSearchList,
  list
} from '@/apiRequest/account'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import {
  GetFollowerReponse,
  GetListReponse,
  GetMeResponse,
  GetSearchUsersReponse,
  UpdateMeReqBodyType
} from '@/types/account'

export const useAccountQuery = () => {
  return useQuery<GetMeResponse>({
    queryKey: ['account-profile'],
    queryFn: getMe
  })
}

export const useUpdateMeMutation = () => {
  const access_token = getAccessTokenFromLocalStorage()

  return useMutation({
    mutationFn: (data: UpdateMeReqBodyType) => {
      if (!access_token) {
        throw new Error('Access token is missing')
      }
      return accountApiRequest.update(data, access_token)
    },
    onError: (error) => {
      console.error('Update error:', error)
    },
    onSuccess: (data) => {
      console.log('Update success:', data)
    }
  })
}
export const useGetUserListQuery = (limit: number, page: number) => {
  return useQuery<GetListReponse>({
    queryKey: ['user-list', limit, page],
    queryFn: () => getUserList(limit, page)
  })
}
export const useGetUserMessageListQuery = (limit: number, page: number) => {
  return useQuery<GetListReponse>({
    queryKey: ['user-message', limit, page],
    queryFn: () => getUserMessageList(limit, page)
  })
}
export const useGetProfileQuery = (user_id: string) => {
  return useQuery<GetMeResponse>({
    queryKey: ['profile', user_id],
    queryFn: () => getProfile(user_id)
  })
}
export const useFollowerQuery = () => {
  return useQuery<GetFollowerReponse>({
    queryKey: ['follower'],
    queryFn: getFollower
  })
}
export const useFollowingQuery = () => {
  return useQuery<GetFollowerReponse>({
    queryKey: ['following'],
    queryFn: getFollowing
  })
}
export const useGetSearchUsersQuery = (searchTerm: string, limit: number) => {
  return useQuery<GetSearchUsersReponse>({
    queryKey: ['search'],
    queryFn: () => getUserSearchList(searchTerm, limit)
  })
}
export const useGetAccountList = (limit: number, page: number) => {
  return useQuery({
    queryKey: ['accounts', limit, page],
    queryFn: () => list(limit, page)
  })
}
export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      })
    }
  })
}
