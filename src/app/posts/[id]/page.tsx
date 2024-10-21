'use client'
import PostDetail from '@/app/posts/[id]/post-details'
import { usePathname } from 'next/navigation'

export default function Page() {
  const pathname = usePathname()
  const tweet_id = pathname.split('/').pop() as string

  return <PostDetail tweet_id={tweet_id} />
}
