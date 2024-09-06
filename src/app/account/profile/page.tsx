'use client'
import React, { useState } from 'react'
import { MoreHorizontal, Newspaper } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname } from 'next/navigation'
import menuItems from '@/app/account/menuItems'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import More from '@/components/more/More'

const posts = [
  {
    id: 1,
    imageUrl: '/images/image1.jpg',
    title: 'Bài viết 1'
  },
  {
    id: 2,
    imageUrl: '/images/image2.jpg',
    title: 'Bài viết 2'
  },
  {
    id: 3,
    imageUrl: '/images/image3.jpg',
    title: 'Bài viết 3'
  },
  {
    id: 4,
    imageUrl: '/images/image4.jpg',
    title: 'Bài viết 4'
  },
  {
    id: 5,
    imageUrl: '/images/image5.jpg',
    title: 'Bài viết 5'
  }
]

export default function Dashboard() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>('home')
  const activeItem = menuItems.find((item) => item.title === activeSection)

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
        <main className='flex-1 grid gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='hidden md:flex flex-col items-start gap-8'>
            {activeItem && activeItem.component && <activeItem.component />}
          </div>
          <div className='flex flex-col items-center p-6'>
            <div className='relative'>
              <Avatar className='w-32 h-32 rounded-full'>
                <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='w-full h-full object-cover' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className='mt-4 text-center'>
              <h2 className='text-xl font-bold text-white-800'>nguyenducninhh</h2>
              <p className='text-sm text-white-500'>Nguyễn Đức Ninh</p>
              <div className='flex justify-center mt-2'>
                <div className='mr-4'>
                  <span className='font-bold text-white-800'>0</span>
                  <span className='text-white-500 ml-1'>bài viết</span>
                </div>
                <div className='mr-4'>
                  <span className='font-bold text-white-800 cursor-pointer'>34 người theo dõi</span>
                </div>
                <div>
                  <span className='font-bold text-white-800 cursor-pointer'>Đang theo dõi 32 người dùng</span>
                </div>
              </div>
            </div>
            <div className='flex mt-4'>
              <Button className='px-4 py-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg'>
                Chỉnh sửa trang cá nhân
              </Button>
              <Button className='px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg'>
                Đăng xuất
              </Button>
            </div>
            <hr className='my-4 border-t border-gray-300 w-full' />
            <div className='flex '>
              <Newspaper className='mr-2' />
              <label className='mb-3'>Bài Viết</label>
            </div>
            <Carousel className='w-full max-w-xs'>
              <CarouselContent>
                {posts.map((post) => (
                  <CarouselItem key={post.id}>
                    <div className='p-1'>
                      <Card>
                        <CardContent className='flex aspect-square items-center justify-center p-6'>
                          <img src={post.imageUrl} alt={post.title} className='object-cover w-full h-full rounded-lg' />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </main>
      </div>
    </div>
  )
}
