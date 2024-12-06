import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, Settings2, UserRoundPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { useUploadMediaMutation, useUploadVideoMutation } from '@/queries/useMedia'
import { useAddPostMutation } from '@/queries/usePost'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { useAccountQuery, useGetSearchUsersQuery } from '@/queries/useAccount'
import { useDebounce } from 'use-debounce'

const limit = 10

export default function Create() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasSelectedImages, setHasSelectedImages] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [isOpenMention, setIsOpenMention] = useState(true)
  const [buttonText, setButtonText] = useState('Tiếp tục')
  const [selectedVideos, setSelectedVideos] = useState<File[]>([])
  const [postContent, setPostContent] = useState('')
  const [mentions, setMentions] = useState<string[]>([]) // Mentioned user IDs
  const [text, setText] = useState('')
  const [debouncedSearchTerm] = useDebounce(text, 1000)

  const { data, refetch } = useGetSearchUsersQuery(debouncedSearchTerm, limit)

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      setIsOpenMention(true)
      refetch()
    }
  }, [debouncedSearchTerm, refetch])

  const users = debouncedSearchTerm.trim() ? data?.results || [] : []

  const handleUserClick = (userId: string) => {
    setMentions((prevMentions) => [...prevMentions, userId])
    setIsOpenMention(false)
    handleReset()
  }

  const handleReset = () => {
    setText('') // Clear the search text
  }

  const uploadMediaMutation = useUploadMediaMutation()
  const uploadVideoMutation = useUploadVideoMutation()
  const addPostMutation = useAddPostMutation()
  const account = useAccountQuery()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const images = files.filter((file) => file.type.startsWith('image/'))
      const videos = files.filter((file) => file.type.startsWith('video/'))

      // Chỉ cho phép tải lên một loại tệp: ảnh hoặc video
      if (selectedImages.length > 0 && videos.length > 0) {
        alert('Bạn chỉ có thể chọn ảnh hoặc video, không thể chọn cả hai.')
        return
      }

      if (selectedVideos.length > 0 && images.length > 0) {
        alert('Bạn chỉ có thể chọn video hoặc ảnh, không thể chọn cả hai.')
        return
      }

      if (images.length > 0) {
        setSelectedImages(images)
        setSelectedVideos([]) // Xóa video nếu người dùng chọn ảnh
      } else if (videos.length > 0) {
        setSelectedVideos(videos)
        setSelectedImages([]) // Xóa ảnh nếu người dùng chọn video
      }

      setCurrentIndex(0)
      setHasSelectedImages(images.length > 0 || videos.length > 0)
    }
  }

  const handlePost = async () => {
    try {
      let medias = [] as { url: string; type: number }[]

      // Handle Image Upload
      if (selectedImages.length > 0) {
        const formDataImages = new FormData()
        selectedImages.forEach((file) => {
          formDataImages.append('image', file)
        })

        const imageResponse = await uploadMediaMutation.mutateAsync(formDataImages)

        // Update medias array for image (with type: 0)
        medias = imageResponse.result.map((media: { url: string; type: number }) => ({
          url: media.url,
          type: 0
        }))
      }

      // Handle Video Upload
      if (selectedVideos.length > 0) {
        const formDataVideos = new FormData()
        selectedVideos.forEach((file) => {
          formDataVideos.append('video', file)
        })

        const videoResponse = await uploadVideoMutation.mutateAsync(formDataVideos)

        // Update medias array for video (with type: 1)
        medias = [
          {
            url: videoResponse.result.url,
            type: 1
          }
        ]
      }

      const accessToken = getAccessTokenFromLocalStorage()

      const postData = {
        body: {
          _id: '',
          user_id: '', // Add actual user ID
          type: 0, // Set the post type (0 for regular posts)
          audience: 0,
          content: postContent,
          parent_id: null,
          hashtags: [],
          mentions,
          medias,
          guest_view: 0,
          user_view: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        access_token: accessToken as string
      }

      if (!addPostMutation.isPending) {
        await addPostMutation.mutateAsync(postData)
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Lỗi khi tải lên phương tiện hoặc tạo bài viết:', error)
    }
  }

  const handleContinue = () => {
    if (hasSelectedImages) {
      setShowTextInput(true)
      setButtonText('Đăng bài')
    }
  }
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1))
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
              {selectedVideos.length > 0 ? (
                // Hiển thị video nếu có video được chọn
                <video
                  controls
                  src={URL.createObjectURL(selectedVideos[currentIndex])}
                  className={`object-cover w-[300px] h-[300px] transition-all duration-300 ${
                    showTextInput ? 'ml-0' : 'mx-auto'
                  }`}
                />
              ) : selectedImages.length > 0 ? (
                // Hiển thị ảnh nếu có ảnh được chọn
                <div className='relative'>
                  <img
                    src={URL.createObjectURL(selectedImages[currentIndex])}
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
              ) : (
                // Hiển thị text nếu chưa chọn gì
                <span className='text-4xl font-semibold'>Ảnh/Video</span>
              )}
            </div>
            {showTextInput && (
              <div className='ml-10 flex-1'>
                <div className='flex space-x-4 mb-4'>
                  <Avatar className='w-7 h-7 rounded-full overflow-hidden'>
                    <AvatarImage
                      className='w-full h-full object-cover'
                      src={account.data?.result.avatar}
                      alt={account.data?.result.name}
                    />
                    <AvatarFallback>{account.data?.result.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='text-sm font-semibold'>{account.data?.result.name}</div>
                  </div>
                </div>
                <div>
                  <Textarea
                    className='h-[200px] w-[350px]'
                    autoFocus
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>
                <hr className='my-4 border-t border-gray-300 w-full' />
                <div className='flex justify-between mb-1'>
                  <input
                    placeholder='Thêm thành viên'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='text-sm text-gray-500 border-none outline-none w-full bg-transparent'
                  />
                  <UserRoundPlus />
                </div>
                {users.length > 0 && isOpenMention && (
                  <Dialog open={isOpenMention} onOpenChange={setIsOpenMention}>
                    <DialogContent>
                      <ul className='space-y-2'>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <li
                              key={user._id}
                              onClick={() => handleUserClick(user._id)}
                              className='flex items-center space-x-4 cursor-pointer'
                            >
                              <Avatar className='w-5 h-5 rounded-full overflow-hidden'>
                                <AvatarImage
                                  className='w-full h-full object-cover'
                                  src={user?.avatar}
                                  alt={user?.name}
                                />
                                <AvatarFallback>{user?.name}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className='text-sm font-semibold flex items-center'>{user?.name}</div>
                              </div>
                            </li>
                          ))
                        ) : debouncedSearchTerm.trim() === '' ? null : (
                          <p>Không tìm thấy người dùng</p>
                        )}
                      </ul>
                    </DialogContent>
                  </Dialog>
                )}
                <div className='flex justify-between'>
                  <div className='text-sm text-gray-500 border-none outline-none w-full bg-transparent'>Cài đặt</div>
                  <Settings2 />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className='flex flex-col items-center w-full mt-10'>
            {hasSelectedImages ? (
              <p onClick={showTextInput ? handlePost : handleContinue} className='cursor-pointer text-white-500'>
                {buttonText}
              </p>
            ) : (
              <>
                <p onClick={() => inputRef.current?.click()} className='cursor-pointer text-white-500'>
                  Chọn ảnh hoặc video từ thiết bị của bạn
                </p>
                <Input
                  id='media'
                  type='file'
                  ref={inputRef}
                  multiple
                  className='hidden'
                  onChange={handleFileChange}
                  accept='image/png, image/jpeg, image/webp, video/mp4, video/webm'
                />
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
