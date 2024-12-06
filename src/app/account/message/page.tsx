'use client'
import React, { useEffect, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import menuItems from '@/app/account/menuItems'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import More from '@/components/more/More'
import { useAccountQuery, useGetSearchUsersQuery, useGetUserMessageListQuery } from '@/queries/useAccount'
import { usePathname, useRouter } from 'next/navigation'
import { useMessageStore } from '@/lib/zustand'
import { useDebounce } from 'use-debounce'

const limit = 10
const page = 1

export default function Dashboard() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [text, setText] = useState('')
  const [debouncedSearchTerm] = useDebounce(text, 1000)

  // Fetch users based on search term
  const { data: searchData, refetch, isLoading } = useGetSearchUsersQuery(debouncedSearchTerm, limit)

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      refetch()
    }
  }, [debouncedSearchTerm, refetch])

  // Get users from the query data or set to an empty array if the search term is empty
  const usersFromApi = debouncedSearchTerm.trim() ? searchData?.results || [] : []

  const accountQuery = useAccountQuery()
  const data = accountQuery.data?.result

  const { activeSection, setActiveSection, selectedUserId, setSelectedUserId } = useMessageStore()
  const getUserMessageListQuery = useGetUserMessageListQuery(limit, page)
  const users = getUserMessageListQuery.data?.result || []

  // Function to handle navigation clicks
  const handleNavClick = (title: string) => {
    setActiveSection(title)
  }

  // Function to handle user click and update URL with receiver_id
  const handleUserClick = (user_id: string) => {
    setSelectedUserId(user_id)
    router.replace(`/account/message/${user_id}`, undefined) // Update the URL with the receiver_id
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
          <div className='relative hidden flex-col items-start gap-4 md:flex'>
            <div>
              <div className='flex items-center space-x-4'>
                <Label htmlFor='terms' className='text-sm mr-20'>
                  {data?.name}
                </Label>

                <div className='relative flex-grow flex items-center'>
                  <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                  <Input
                    type='search'
                    placeholder='Tìm kiếm trò chuyện'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='w-full rounded-lg bg-background pl-10 pr-3 py-2'
                  />
                </div>
              </div>
            </div>
            <hr className='my-4 border-t border-gray-300 w-full' />
            <Label htmlFor='terms' className='text-xl mb-10'>
              Tin nhắn
            </Label>

            {/* Show search results if there is a search term, otherwise show message users */}
            {(debouncedSearchTerm.trim() ? usersFromApi : users).map((user) => (
              <div
                key={user._id}
                className='flex items-center space-x-4 mb-4 cursor-pointer'
                onClick={() => handleUserClick(user._id)}
              >
                <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                  <AvatarImage className='w-full h-full object-cover' src={user.avatar} alt={user.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <div className='text-lg font-semibold flex items-center'>{user.name}</div>
                  <div className='text-sm text-gray-500'>{user.username}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
            <div className='flex flex-col items-center justify-center h-screen'>
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
