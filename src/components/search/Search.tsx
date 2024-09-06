import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SearchCheck, Search } from 'lucide-react'

export default function SearchPage() {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side='left' className='p-4 w-80 md:w-96 lg:w-[400px]'>
        <SheetHeader>
          <SheetTitle>Tìm Kiếm</SheetTitle>
        </SheetHeader>
        <div className='flex items-center gap-2 mt-4'>
          <div className='relative flex-grow'>
            <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input type='search' placeholder='Search...' className='w-full rounded-lg bg-background pl-10 pr-3 py-2' />
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
      </SheetContent>
    </Sheet>
  )
}
