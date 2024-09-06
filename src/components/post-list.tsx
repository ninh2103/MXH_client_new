import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar } from '@radix-ui/react-avatar'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, SquareArrowOutUpRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const users = [
  {
    id: 1,
    avatarSrc: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'John Doe',
    userName: 'john_doe',
    imageUrl: ['/images/image1.jpg', '/images/image2.jpg', '/images/image3.jpg'],
    title: 'My Awesome Post'
  },
  {
    id: 2,
    avatarSrc: 'https://randomuser.me/api/portraits/women/2.jpg',
    name: 'Jane Smith',
    userName: 'jane_smith',
    imageUrl: ['/images/image4.jpg', '/images/image5.jpg'],
    title: 'Another Great Post'
  }
]

export default function PostList() {
  const [currentIndices, setCurrentIndices] = useState(users.map(() => 0))

  const handleImageChange = (userIndex: any, index: any) => {
    setCurrentIndices((prevIndices) => {
      const newIndices = [...prevIndices]
      newIndices[userIndex] = index
      return newIndices
    })
  }

  return (
    <div className='flex flex-col items-center py-8'>
      {users.map((user, userIndex) => (
        <div key={user.id} className='w-1/3 rounded overflow-hidden shadow-lg mb-8'>
          <div className='flex justify-between w-full cursor-pointer mb-3'>
            <div className='flex items-center space-x-4'>
              <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                <AvatarImage
                  className='w-full h-full object-cover'
                  src={user.avatarSrc}
                  alt={`Avatar of ${user.name}`}
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <div className='text-base font-semibold text-black-900'>{user.name}</div>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger>
                <MoreHorizontal />
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem thêm</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className='relative max-w-sm w-full'>
            <div className='relative h-96 w-full overflow-hidden rounded-lg'>
              <Image
                src={user.imageUrl[currentIndices[userIndex]]}
                alt={`Slide ${currentIndices[userIndex] + 1}`}
                layout='fill'
                objectFit='cover'
              />
            </div>

            <div className='flex justify-center mt-4 space-x-2'>
              {user.imageUrl.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleImageChange(userIndex, index)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                    currentIndices[userIndex] === index ? 'bg-gray-800' : 'bg-gray-400'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <div className='flex justify-between items-center w-full cursor-pointer'>
              <div className='flex space-x-4'>
                <Heart className='w-6 h-6 text-white-800' />
                <MessageCircle className='w-6 h-6 text-white-800' />
                <SquareArrowOutUpRight className='w-6 h-6 text-white-800' />
              </div>
              <div>
                <Bookmark className='w-6 h-6 text-white-800' />
              </div>
            </div>

            <div className=''>
              <div className='flex font-semibold text-sm'>
                <Avatar className='w-3 h-3 rounded-full overflow-hidden mt-1'>
                  <AvatarImage className='w-3 h-3 object-cover' src={user.avatarSrc} alt={`Avatar of ${user.name}`} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <p className='ml-1'>1,000 likes</p>
              </div>

              <div className='flex items-center mb-1'>
                <p className='text-sm font-semibold'>{user.userName}</p>
                <span className='text-sm ml-1'>🌟 Awesome post!</span>
              </div>

              <div className='text-sm text-gray-500 mb-1'>View all comments</div>
              <div className='text-sm text-gray-500'>Add a comment...</div>
            </div>
          </div>
          <hr className='my-4 border-t border-gray-300 w-full' />
        </div>
      ))}
    </div>
  )
}
