import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, MoveLeft, Settings2, UserRoundPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'

export default function Create() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasSelectedImages, setHasSelectedImages] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [buttonText, setButtonText] = useState('Tiếp tục')

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const imageUrls = files.map((file) => URL.createObjectURL(file))
      setSelectedImages(imageUrls)
      setCurrentIndex(0)
      setHasSelectedImages(true)
    }
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1))
  }

  const handleContinue = () => {
    if (hasSelectedImages) {
      setShowTextInput(true)
      setButtonText('Đăng bài')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[800px] h-[450px]'>
        <DialogHeader>
          <DialogTitle className='text-center mb-2'>Tạo bài viết mới</DialogTitle>
          <hr className='my-4 border-t border-gray-300 w-full' />
        </DialogHeader>

        <div className={`grid gap-4 py-4 items-center h-full ${showTextInput ? 'justify-start' : 'justify-center'}`}>
          <div className='relative flex items-center justify-center w-full'>
            <div className='flex w-full'>
              {selectedImages.length > 0 ? (
                <>
                  <div className='relative'>
                    <img
                      src={selectedImages[currentIndex]}
                      alt={`Selected ${currentIndex}`}
                      className={`object-cover w-[300px] h-[300px] transition-all duration-300 ${
                        showTextInput ? 'ml-0' : 'mx-auto'
                      }`}
                    />

                    {selectedImages.length > 1 && (
                      <>
                        <ArrowLeft
                          className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer'
                          onClick={handlePrev}
                        />
                        <ArrowRight
                          className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer'
                          onClick={handleNext}
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <span className='text-4xl font-semibold'>Ảnh/Video</span>
              )}
            </div>
            {showTextInput && (
              <div className='ml-10 flex-1'>
                <div className='flex  space-x-4 mb-4'>
                  <Avatar className='w-7 h-7 rounded-full overflow-hidden'>
                    <AvatarImage
                      className='w-full h-full object-cover'
                      src='https://github.com/shadcn.png'
                      alt='@shadcn'
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='text-sm font-semibold'>nguyenducninhh</div>
                  </div>
                </div>
                <div>
                  <Textarea className='h-[200px] w-[350px]' autoFocus />
                </div>
                <hr className='my-4 border-t border-gray-300 w-full' />

                <div className='flex justify-between mb-1'>
                  <div>Thêm thành viên</div>
                  <UserRoundPlus />
                </div>
                <div className='flex justify-between'>
                  <div>Cài đặt</div>
                  <Settings2 />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className='flex flex-col items-center w-full mt-10'>
            {hasSelectedImages ? (
              <p onClick={handleContinue} className='cursor-pointer text-white-500'>
                {buttonText}
              </p>
            ) : (
              <>
                <p onClick={handleClick} className='cursor-pointer text-white-500'>
                  Chọn ảnh từ thiết bị của bạn
                </p>
                <Input
                  id='picture'
                  type='file'
                  ref={inputRef}
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
