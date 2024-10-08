'use client'
import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname } from 'next/navigation'
import menuItems from '@/app/account/menuItems'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import More from '@/components/more/More'
import { Label } from '@radix-ui/react-label'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import PostList from '@/components/post-list'

const users = [
  {
    id: 7,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  },
  {
    id: 6,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  },
  {
    id: 1,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  },
  {
    id: 2,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  },
  {
    id: 3,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  },
  {
    id: 4,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  },
  {
    id: 5,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninhdz',
    userName: 'NguyenDucNinh'
  }
]
function HomePage() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>('home')

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
          <h1 className='text-xl font-semibold'>Playground</h1>
        </header>
        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='relative hidden flex-col items-start gap-8 md:flex' x-chunk='dashboard-03-chunk-0'>
            {activeItem && activeItem.component && <activeItem.component />}

            <div className='flex items-center space-x-4 cursor-pointer'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <div className='text-xl font-semibold flex items-center'>nguyenducninh</div>
                <div className='text-lg font-semibold flex items-center'>Nguyễn Đức Ninh</div>
              </div>
            </div>
            <div className='flex justify-between w-full'>
              <Label htmlFor='terms' className='text-sm mb-8'>
                Gợi ý cho bạn
              </Label>
              <Label htmlFor='terms' className='text-sm mb-8 cursor-pointer'>
                Xem tất cả
              </Label>
            </div>

            <div className='flex flex-col gap-4 justify-between w-full cursor-pointer'>
              {users.map((user) => (
                <div key={user.id} className='flex items-center justify-between w-full space-x-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-10 h-10 rounded-full overflow-hidden'>{user.avatar}</div>
                    <div className='flex flex-col'>
                      <div className='text-base font-semibold text-black-900'>{user.name}</div>
                      <div className='text-sm text-white-500'>{user.userName}</div>
                    </div>
                  </div>

                  <div className=''>
                    <div className='text-sm font-semibold '>theo dõi</div>
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

export default HomePage
