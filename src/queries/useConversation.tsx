import { getReceiver } from '@/apiRequest/conversation'
import { getReceiverReponse } from '@/types/conversation'
import { useQuery } from '@tanstack/react-query'

export const useGetReceiverQuery = (limit: number, page: number, receiver_id: string) => {
  return useQuery<getReceiverReponse>({
    queryKey: ['get-receiver', limit, page, receiver_id],
    queryFn: () => getReceiver(limit, page, receiver_id)
  })
}
