import http from '@/lib/http'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { getReceiverReponse } from '@/types/conversation'

export const getReceiver = async (limit: number, page: number, receiver_id: string): Promise<getReceiverReponse> => {
  const accessToken = getAccessTokenFromLocalStorage()

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const url = `/conversations/receiver/${receiver_id}?limit=${limit}&page=${page}`
  console.log('Receiver ID:', receiver_id)

  console.log('API URL:', url)

  const response = await http.get<getReceiverReponse>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return response.payload
}
