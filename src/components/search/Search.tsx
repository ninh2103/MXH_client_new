'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Search } from 'lucide-react'
import { useGetSearchUsersQuery } from '@/queries/useAccount'
import { useDebounce } from 'use-debounce'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

const limit = 10

export default function SearchPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [text, setText] = useState('')
  const router = useRouter()

  const [debouncedSearchTerm] = useDebounce(text, 1000)

  const { data, refetch, isLoading } = useGetSearchUsersQuery(debouncedSearchTerm, limit)

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      refetch()
    }
  }, [debouncedSearchTerm, refetch])

  // Get users from the query data or set to an empty array if the search term is empty
  const users = debouncedSearchTerm.trim() ? data?.results || [] : []

  const handleClose = () => {
    setIsOpen(false)
    handleReset()
  }
  const handleReset = () => {
    setText('') // Clear the search text
  }
  const handleUserClick = (userId: any) => {
    router.push(`/${userId}`) // Giả sử đường dẫn hồ sơ của bạn là /profile/[userId]
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side='left' className='p-4 w-80 md:w-96 lg:w-[400px]'>
        <SheetHeader>
          <SheetTitle>Tìm Kiếm</SheetTitle>
        </SheetHeader>

        {/* Search input */}
        <div className='flex items-center gap-2 mt-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search...'
              value={text}
              onChange={(e) => setText(e.target.value)}
              className='w-full rounded-lg bg-background pl-10 pr-3 py-2'
            />
          </div>
        </div>

        <SheetFooter>
          <div className='mt-4'>
            <SheetClose asChild>
              <Button variant='outline' onClick={handleClose}>
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>

        <hr className='my-4 border-t border-gray-300 w-full' />

        {/* Search results displayed below hr */}
        <div className='mt-4'>
          {isLoading ? (
            <p>Enter to search</p>
          ) : (
            <ul className='space-y-2'>
              {users.length > 0 ? (
                users.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className='flex items-center space-x-4 cursor-pointer'
                  >
                    <Avatar className='w-5 h-5 rounded-full overflow-hidden'>
                      <AvatarImage className='w-full h-full object-cover' src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='text-sm font-semibold flex items-center'>{user?.name}</div>
                      <div className='text-sm font-semibold flex items-center'>{user?.username}</div>
                    </div>
                  </li>
                ))
              ) : debouncedSearchTerm.trim() === '' ? null : (
                <p>Không tìm thấy người dùng</p>
              )}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
