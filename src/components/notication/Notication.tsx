import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function NoticationPage() {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side='left' className='p-4 w-80 md:w-96 lg:w-[400px]'>
        <SheetHeader>
          <SheetTitle>Thông báo</SheetTitle>
        </SheetHeader>
        <SheetDescription className='m-5 text-xl '>Gần đây</SheetDescription>
        <div className='flex items-center space-x-2 text-sm'>
          <div className='flex space-x-1'>
            <p className='text-white-800'>
              <span className='font-semibold'>ninh</span>,<span className='font-semibold'>đức</span>
              <span className='font-semibold'> và những người khác</span> đã thích tin của bạn.
              <div>
                <span className='text-gray-700'>2 tuần</span>
              </div>
            </p>
          </div>
        </div>
        <SheetFooter>
          <div className='mt-4'></div>
        </SheetFooter>
        <hr className='my-4 border-t border-gray-300 w-full' />
      </SheetContent>
    </Sheet>
  )
}
