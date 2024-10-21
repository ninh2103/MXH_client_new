'use client'
import React, { useEffect, useState } from 'react'
import { Newspaper } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname } from 'next/navigation'
import menuItems from '@/app/account/menuItems'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import More from '@/components/more/More'
import { useGetProfileQuery } from '@/queries/useAccount'
import { cn, getAccessTokenFromLocalStorage } from '@/lib/utils'
import { useFollowMutation, useUnfollowMutation } from '@/queries/useFollow'
import { useNewFeedMetQuery, useUserPostMetQuery } from '@/queries/usePost'

export default function Dashboard() {
  const pathname = usePathname()
  const user_id = pathname.split('/').pop()
  const [activeSection, setActiveSection] = useState<string>('home')
  const [followedUsers, setFollowedUsers] = useState<string[]>([])
  const userPostQuery = useUserPostMetQuery(user_id || '')
  const posts = userPostQuery.data?.result.posts || []
  const followersCount = userPostQuery.data?.result.followersCount || 0
  const followingCount = userPostQuery.data?.result.followingCount || 0
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const activeItem = menuItems.find((item) => item.title === activeSection)
  const profileMutation = useGetProfileQuery(user_id || '')
  const account = profileMutation.data?.result
  const FollowMutation = useFollowMutation()
  const UnfollowMutation = useUnfollowMutation()

  const isFollowed = followedUsers.includes(user_id as string)

  const handleFollow = (userId: string) => {
    const accessToken = getAccessTokenFromLocalStorage() as string
    if (!isFollowed) {
      // Nếu chưa theo dõi, gọi API Follow
      FollowMutation.mutate(
        {
          body: { followed_user_id: userId },
          access_token: accessToken
        },
        {
          onSuccess: () => {
            setFollowedUsers((prev) => [...prev, userId]) // Cập nhật danh sách người đã theo dõi
            setIsFollowing(true) // Cập nhật trạng thái đang theo dõi
          }
        }
      )
    } else {
      UnfollowMutation.mutate(userId, {
        onSuccess: () => {
          setFollowedUsers((prev) => prev.filter((id) => id !== userId)) // Xóa user khỏi danh sách theo dõi
          setIsFollowing(false) // Cập nhật trạng thái về chưa theo dõi
        }
      })
    }
  }

  const handleNavClick = (title: string) => {
    setActiveSection(title)
  }

  return (
    <div className='flex h-screen'>
      <aside className='fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background'>
        <nav className='flex flex-col items-center gap-4 px-2 py-4'>
          {menuItems.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                {item.href ? (
                  <Link href={item.href}>
                    <div
                      onClick={() => handleNavClick(item.title)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground cursor-pointer md:h-8 md:w-8',
                        { 'bg-accent text-accent-foreground': activeSection === item.title }
                      )}
                    >
                      <item.Icon className='h-5 w-5' />
                      <span className='sr-only'>{item.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={() => handleNavClick(item.title)}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground cursor-pointer md:h-8 md:w-8',
                      { 'bg-accent text-accent-foreground': activeSection === item.title }
                    )}
                  >
                    <item.Icon className='h-5 w-5' />
                    <span className='sr-only'>{item.title}</span>
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent side='right'>{item.title}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-4'>
          <More />
        </nav>
      </aside>
      <div className='flex flex-col flex-1 ml-[53px]'>
        <header className='sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4'>
          <h1 className='text-xl font-semibold'>Playground</h1>
        </header>
        <div className='flex items-start p-6 space-x-4'>
          {/* Avatar Section */}
          <div className='flex-shrink-0'>
            <Avatar className='w-32 h-32 rounded-full'>
              <AvatarImage src={account?.avatar} alt='@shadcn' className='w-full h-full object-cover' />
              <AvatarFallback>{account?.name}</AvatarFallback>
            </Avatar>
          </div>

          {/* Info and Posts Section */}
          <div className='flex-1'>
            {/* User Info */}
            <div className='text-left mb-4'>
              <h2 className='text-2xl font-bold text-white-800'>{account?.username}</h2>
              <p className='text-sm text-white-500'>{account?.name}</p>
              <div className='flex mt-2'>
                <div className='mr-4'>
                  <span className='font-bold text-white-800'>{posts.length}</span>
                  <span className='text-white-500 ml-1'>bài viết</span>
                </div>
                <div className='mr-4'>
                  <span className='font-bold text-white-800 cursor-pointer'>{followersCount} người theo dõi</span>
                </div>
                <div>
                  <span className='font-bold text-white-800 cursor-pointer'>
                    Đang theo dõi {followingCount} người dùng
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex mt-4'>
              <Button
                className={cn(
                  'px-4 py-2 mr-2 text-sm font-semibold border rounded-lg',
                  isFollowed
                    ? 'text-gray-700 bg-gray-200 border-gray-300' // Hiển thị trạng thái đang theo dõi
                    : 'text-gray-700 bg-gray-100 border-gray-300' // Hiển thị trạng thái theo dõi
                )}
                onClick={() => handleFollow(user_id as string)} // Gọi hàm handleFollow khi click vào
              >
                {isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
              </Button>
              <Button className='px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg'>
                Nhắn tin
              </Button>
            </div>

            {/* Divider */}
            <hr className='my-4 border-t border-gray-300 w-full' />

            {/* Posts Section */}
            {/* Posts Section */}
            <div className='flex items-center justify-center mb-3'>
              <Newspaper className='mr-2' />
              <label>Bài Viết</label>
            </div>
            <div className='max-h-[600px] overflow-y-auto p-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 p-4'>
                {posts.map((post, index) => (
                  <Link href={`/posts/${post._id}`} key={index} className='bg-white p-1 rounded-lg shadow-md'>
                    <img
                      src={post.medias[0].url}
                      alt={post._id}
                      className='w-full h-full object-cover rounded-md aspect-square mb-2'
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
