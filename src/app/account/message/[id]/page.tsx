'use client'
import React, { useEffect, useState } from 'react'
import { CircleAlert, Search, SendHorizontal, Paperclip, ClipboardPen, PencilLine } from 'lucide-react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import menuItems from '@/app/account/menuItems'
import { usePathname, useRouter } from 'next/navigation'
import More from '@/components/more/More'
import { useGetProfileQuery, useGetUserMessageListQuery } from '@/queries/useAccount'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetReceiverQuery } from '@/queries/useConversation'
import useStore from '@/lib/zustand'
import useCheck from '@/queries/useCheck'
import socket from '@/lib/socket'

const limit = 10
const page = 1
const profile =
  typeof window !== 'undefined' && localStorage.getItem('profile')
    ? JSON.parse(localStorage.getItem('profile') as string)
    : null

export default function Dashboard() {
  useCheck()

  const pathname = usePathname()
  const user_id = pathname.split('/').pop() || ''
  const router = useRouter()
  const { activeSection, selectedUserId, setActiveSection, setSelectedUserId } = useStore()
  const [messageContent, setMessageContent] = useState('')
  const [conversations, setConversations] = useState<{ content: any; isSender: boolean }[]>([])
  const [receiver, setReceiver] = useState('')

  const getUserMessageListQuery = useGetUserMessageListQuery(limit, page)
  const users = getUserMessageListQuery.data?.result || []

  const profileMutation = useGetProfileQuery(user_id || '')
  const account = profileMutation.data?.result

  const getReceiverQuery = useGetReceiverQuery(limit, page, receiver)
  const data = getReceiverQuery.data?.result?.conversations || []

  useEffect(() => {
    if (account?._id) {
      setReceiver(account._id)
    }
  }, [account?._id])

  useEffect(() => {
    if (profile?._id) {
      socket.auth = {
        _id: profile._id
      }
      socket.connect()

      socket.on('reciver_message', (data) => {
        console.log('data', data)
        const content = data.content
        setConversations((conversations) => [
          ...conversations,
          {
            content,
            isSender: false
          }
        ])
      })

      return () => {
        if (socket.connected) {
          socket.disconnect()
        }
      }
    }
  }, [profile])

  useEffect(() => {
    console.log('Conversation data:', data)
    if (data.length > 0) {
      setConversations(
        data.map((message: any) => ({
          content: message.content,
          isSender: message.sender_id === profile?._id
        }))
      )
    }
  }, [data])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setMessageContent('')
    socket.emit('private_message', {
      content: messageContent,
      to: receiver,
      from: profile?._id
    })
    setConversations((prevConversations) => [
      ...prevConversations,
      {
        content: messageContent,
        isSender: true
      }
    ])
  }

  const handleNavClick = (title: string) => {
    setActiveSection(title)
  }

  const handleUserClick = (user_id: string) => {
    setSelectedUserId(user_id)
    router.push(`/account/message/${user_id}`)
  }

  const handleSendMessage = () => {
    if (!messageContent.trim()) return

    handleSubmit({ preventDefault: () => {} })
  }

  return (
    <React.StrictMode>
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
            <div className='relative hidden flex-col items-start gap-4 md:flex'>
              <div className='relative hidden flex-col items-start gap-4 md:flex'>
                <div>
                  <div className='flex items-center space-x-4'>
                    <Label htmlFor='terms' className='text-xl mr-20'>
                      nguyenducninhh
                    </Label>
                    <div className='relative flex-grow flex items-center'>
                      <p className='w-full rounded-lg bg-background pl-10 pr-3 py-2'>
                        đang trò chuyện với {account?.name}
                      </p>
                      <PencilLine className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 ' />
                    </div>
                  </div>
                </div>
                <hr className='my-4 border-t border-gray-300 w-full' />
                <Label htmlFor='terms' className='text-xl mb-10'>
                  Tin nhắn
                </Label>
                {users.map((user) => (
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
            </div>

            <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-4 cursor-pointer'>
                    <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                      <AvatarImage className='w-full h-full object-cover' src={account?.avatar} alt={account?.name} />
                      <AvatarFallback>{account?.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='text-xl font-semibold flex items-center'>{account?.name}</div>
                      <div className='text-lg font-semibold flex items-center'>{account?.username}</div>
                    </div>
                  </div>
                </div>
                <CircleAlert />
              </div>
              <hr className='my-4 border-t border-gray-300 w-full' />

              <div className='flex flex-col flex-1 p-4 overflow-y-auto'>
                {conversations.length > 0 ? (
                  conversations
                    .slice() // Create a shallow copy of the conversations array to avoid mutating the original one.
                    .reverse() // Reverse the order of messages.
                    .map((message, index) => (
                      <div key={index} className={`flex ${message.isSender ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div
                          className={`p-2 rounded-lg max-w-xs ${
                            message.isSender ? 'bg-primary text-black' : 'bg-secondary'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <p className='text-gray-400 text-sm'>Không có tin nhắn</p>
                  </div>
                )}
              </div>

              <form
                //onSubmit={handleSubmit}
                className='relative flex items-center justify-between rounded-lg border px-4'
              >
                <Paperclip />
                <Input
                  id='text'
                  type='text'
                  placeholder='Aa'
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className='px-4 py-1.5 border-0 focus-visible:ring-0 outline-none flex-grow'
                />
                <SendHorizontal onClick={handleSendMessage} className='cursor-pointer' />
              </form>
            </div>
          </main>
        </div>
      </div>
    </React.StrictMode>
  )
}
