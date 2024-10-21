'use client'
import Modal from '@/app/@modal/(.)posts/[id]/modal'
import PostDetail from '@/app/posts/[id]/post-details'
import { usePathname } from 'next/navigation'

export default function PostPage() {
  const pathname = usePathname()
  const tweet_id = pathname.split('/').pop() as string
  return (
    <Modal>
      <PostDetail tweet_id={tweet_id} />
    </Modal>
  )
}
