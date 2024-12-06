'use client'
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import menuItems from '@/app/account/menuItems'
import { cn, getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import More from '@/components/more/More'

import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import PostList from '@/components/post-list'
import { useAccountQuery, useGetUserListQuery } from '@/queries/useAccount'
import { useFollowMutation } from '@/queries/useFollow'

import { Button } from '@/components/ui/button'

const limit = 10
const page = 1

export default function People() {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [followedUsers, setFollowedUsers] = useState<string[]>([])
  const getUserListQuery = useGetUserListQuery(limit, page)
  const users = getUserListQuery.data?.result || []
  const FollowMutation = useFollowMutation()
  const accessToken = getAccessTokenFromLocalStorage() as string
  const accountQuery = useAccountQuery()

  const handleFollow = (user_id: string) => {
    FollowMutation.mutate(
      {
        body: { followed_user_id: user_id },

        access_token: accessToken
      },
      {
        onSuccess: () => {
          setFollowedUsers((prev) => [...prev, user_id])
        }
      }
    )
  }

  const activeItem = menuItems.find((item) => item.title === activeSection)

  const handleNavClick = (title: string) => {
    setActiveSection(title)
  }
  return (
    <div className='grid h-screen w-full pl-[53px]'>
      <aside className='inset-y fixed left-0 z-20 flex h-full flex-col border-r'>
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
      <div className='flex flex-col'>
        <header className='sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4'>
          <h1 className='text-xl font-semibold'>WE</h1>
        </header>
        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='relative hidden flex-col items-start gap-8 md:flex'>
            {activeItem && activeItem.component && <activeItem.component />}

            <div className='flex flex-col gap-4 justify-between w-full cursor-pointer'>
              {users.map((user) => (
                <div key={user._id} className='flex items-center justify-between w-full space-x-4'>
                  <Link href={`/${user._id}`} passHref>
                    <div className='flex items-center space-x-4'>
                      <div className='w-10 h-10 rounded-full overflow-hidden'>
                        <Avatar>
                          <AvatarImage className='w-full h-full object-cover' src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className='flex flex-col'>
                        <div className='text-base font-semibold text-black-900'>{user.name}</div>
                        <div className='text-sm text-white-500'>{user.username}</div>
                      </div>
                    </div>
                  </Link>

                  <div className=''>
                    {followedUsers.includes(user._id) ? (
                      <div className='text-sm text-blue-500 font-semibold'>Đã theo dõi</div>
                    ) : (
                      <Button className='text-sm bg-blue-500 font-semibold' onClick={() => handleFollow(user._id)}>
                        Theo dõi
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
            <PostList />
            <div className='flex-1' />
          </div>
        </main>
      </div>
    </div>
  )
}
