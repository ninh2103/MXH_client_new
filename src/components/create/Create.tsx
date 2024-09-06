import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
export default function Create() {
  const [isOpen, setIsOpen] = useState(true)
  const handleClose = () => setIsOpen(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-center mb-2'>Tạo bài viết mới</DialogTitle>
          <hr className='my-4 border-t border-gray-300 w-full' />
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center justify-center gap-4'>
            <div className='p-1 col-span-4'>
              <Card>
                <CardContent className='flex aspect-square w-full items-center justify-center p-6'>
                  <span className='text-4xl font-semibold'>Ảnh/Video</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type='submit' className='mx-auto'>
            Chọn từ thiết bị của bạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
