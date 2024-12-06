'use client'
import React, { useState } from 'react'
import { MoreHorizontal, Newspaper, Search } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname, useRouter } from 'next/navigation'
import menuItems from '@/app/account/menuItems'
import { cn, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import More from '@/components/more/More'
import { useAccountQuery, useFollowerQuery, useFollowingQuery } from '@/queries/useAccount'
import { useLogoutMutation } from '@/queries/useAuth'
import { useNewFeedMetQuery } from '@/queries/usePost'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'followers' | 'following' | null>(null)

  const activeItem = menuItems.find((item) => item.title === activeSection)
  const accountQuery = useAccountQuery()
  const followerQuery = useFollowerQuery()
  const followingQuery = useFollowingQuery()
  const followerData = followerQuery.data?.result || []
  const followingData = followingQuery.data?.result || []

  const account = accountQuery.data?.result
  console.log('account', account)
  const myPostQuery = useNewFeedMetQuery()
  const posts = myPostQuery.data?.result.posts || []
  const followersCount = myPostQuery.data?.result.followersCount || 0
  const followingCount = myPostQuery.data?.result.followingCount || 0

  console.log('posts', posts)

  const route = useRouter()
  const logoutMutation = useLogoutMutation()

  const handleLogout = () => {
    const refresh_token = getRefreshTokenFromLocalStorage() as string
    logoutMutation.mutate({ refresh_token })
    localStorage.removeItem('access_token'), localStorage.removeItem('refresh_token')
    route.push('/login')
  }

  const handleNavClick = (title: string) => {
    setActiveSection(title)
  }
  const handleDialogOpen = (type: 'followers' | 'following') => {
    setDialogType(type)
    setDialogOpen(true)
  }

  // Dữ liệu hiển thị dựa trên trạng thái dialogType
  const dialogData = dialogType === 'followers' ? followerData : followingData
  const dialogTitle = dialogType === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'

  return (
    <div className='grid h-screen w-full pl-[53px]'>
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
          <h1 className='text-xl font-semibold'>WE</h1>
        </header>
        <div className='hidden md:flex flex-col items-start gap-8'>
          {activeItem && activeItem.component && <activeItem.component />}
        </div>
        <div className='flex items-start p-6 space-x-4'>
          {/* Avatar Section */}
          <div className='flex-shrink-0'>
            <Avatar className='w-32 h-32 rounded-full'>
              <AvatarImage
                src={account?.avatar}
                alt={account?.name || 'Avatar'}
                className='w-full h-full object-cover'
              />
              <AvatarFallback>{account?.name}</AvatarFallback>
            </Avatar>
          </div>

          {/* Info and Posts Section */}
          <div className='flex-1'>
            {/* User Info */}
            <div className='text-left mb-4'>
              <h2 className='text-2xl font-bold text-white-800'>{account?.name}</h2>
              <p className='text-sm text-white-500'>{account?.username}</p>
              <div className='flex mt-2'>
                <div className='mr-4'>
                  <span className='font-bold text-white-800'>{posts.length}</span>
                  <span className='text-white-500 ml-1'>bài viết</span>
                </div>
                <div className='mr-4'>
                  <span
                    className='font-bold text-white-800 cursor-pointer'
                    onClick={() => handleDialogOpen('followers')}
                  >
                    {followersCount} người theo dõi
                  </span>
                </div>
                <div>
                  <span
                    className='font-bold text-white-800 cursor-pointer'
                    onClick={() => handleDialogOpen('following')}
                  >
                    {' '}
                    đang theo dõi {followingCount} người
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex mt-4'>
              <Link
                href={`/account/update`}
                className='px-4 py-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg'
              >
                Chỉnh sửa trang cá nhân
              </Link>
              <Button
                className='px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg'
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>

            {/* Divider */}
            <hr className='my-4 border-t border-gray-300 w-full' />

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

      <Dialog open={isDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {dialogData.map((person: any) => (
              <div key={person._id} className='flex items-center space-x-4 mb-4 cursor-pointer'>
                <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                  <AvatarImage className='w-full h-full object-cover' src={person.avatar} />
                  <AvatarFallback>{person.username}</AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                  <p className='text-sm font-semibold leading-none'>{person.name}</p>
                  <p className='text-xs text-muted-foreground'>{person.username}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
