'use client'
import React, { useState } from 'react'
import { MessageCircle, MoreHorizontal, Search } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname, useRouter } from 'next/navigation'
import menuItems from '@/app/account/menuItems'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import More from '@/components/more/More'

type Message = {
  text: string
  isSender: boolean
  avatar: string | null
}

type Messages = Record<number, Message[]>

const messages: Messages = {
  1: [
    { text: 'Hi there! How are you?', isSender: false, avatar: 'https://github.com/shadcn.png' },
    { text: 'I am good, thanks for asking!', isSender: true, avatar: null }
  ],
  2: [
    { text: 'Hello, what’s up?', isSender: false, avatar: 'https://github.com/shadcn.png' },
    { text: 'Just working on some projects.', isSender: true, avatar: null }
  ],
  3: [
    { text: 'Are you free this weekend?', isSender: false, avatar: 'https://github.com/shadcn.png' },
    { text: 'Yes, I am. What’s up?', isSender: true, avatar: null }
  ]
}

const users = [
  {
    id: 1,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninh1',
    activity: 'Hoạt động 2 giờ trước'
  },
  {
    id: 2,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninh2',
    activity: 'Hoạt động 2 giờ trước'
  },
  {
    id: 3,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninh3',
    activity: 'Hoạt động 2 giờ trước'
  },
  {
    id: 4,
    avatar: (
      <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    name: 'ninh4',
    activity: 'Hoạt động 2 giờ trước'
  }
]
export default function Dashboard() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>('home')
  const activeItem = menuItems.find((item) => item.title === activeSection)

  const handleNavClick = (title: string) => {
    setActiveSection(title)
  }
  const [activeUserId, setActiveUserId] = useState<number | null>(null)

  const handleUserClick = (id: number) => {}

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
        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 '>
          <div className='relative hidden flex-col items-start gap-4 md:flex ' x-chunk='dashboard-03-chunk-0 '>
            {activeItem && activeItem.component && <activeItem.component />}
            <div>
              <div className='flex items-center space-x-4'>
                <Label htmlFor='terms' className='text-xl mr-20'>
                  nguyenducninhh
                </Label>

                <div className='relative flex-grow flex items-center '>
                  <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  <Input
                    type='search'
                    placeholder='Tìm kiếm trò chuyện'
                    className='w-full rounded-lg bg-background pl-10 pr-3 py-2'
                  />
                </div>
              </div>
            </div>
            <hr className='my-4 border-t border-gray-300 w-full' />
            <Label htmlFor='terms' className='text-xl mb-10'>
              Tin nhắn
            </Label>

            {users.map((user) => (
              <Link
                href={`/account/message/${user.id}`}
                key={user.id}
                className='flex items-center space-x-4 mb-4'
                onClick={() => handleUserClick(user.id)}
              >
                {user.avatar}
                <div>
                  <div className='text-lg font-semibold flex items-center'>{user.name}</div>
                  <div className='text-sm text-gray-500'>{user.activity}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
            <div className='flex flex-col items-center justify-center h-screen '>
              <div className='flex items-center justify-center w-10 h-10 mb-4 bg-gray-200 rounded-full'>
                <MessageCircle className='w-8 h-8 text-gray-600' fill='currentColor'></MessageCircle>
              </div>
              <p className='mb-2 text-xl font-semibold text-white-700'>Tin nhắn của bạn</p>
              <p className='text-white-500'>Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
