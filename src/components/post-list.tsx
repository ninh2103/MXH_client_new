import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { decodeToken, getAccessTokenFromLocalStorage } from '@/lib/utils'
import { useBookmarkMutation, useUnBookmarkMutation } from '@/queries/usebookmark'
import { useCommentMutation } from '@/queries/useComment'
import { uselikeMutation, useUnLikeMutation } from '@/queries/useLike'
import { useNewFeedRandomtQuery, useNewFeedtQuery } from '@/queries/usePost'
import { Avatar } from '@radix-ui/react-avatar'

import { Bookmark, Heart, MessageCircle, MoreHorizontal, SquareArrowOutUpRight, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const limit = 10
const page = 1

export default function PostList() {
  const [currentIndices, setCurrentIndices] = useState<{ [key: string]: number }>({})
  const router = useRouter()
  const accessToken = getAccessTokenFromLocalStorage() as string
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({})
  const [showDialog, setShowDialog] = useState<{ [key: string]: boolean }>({})
  const [parentId, setParentId] = useState<{ [key: string]: string }>({})
  const { data: feedData, refetch: refetchFeed } = useNewFeedtQuery(limit, page)
  const { data: randomFeedData, refetch: refetchRandomFeed } = useNewFeedRandomtQuery(limit, page)

  // const accountQuery = useGetProfileQuery( || '')
  // const users = accountQuery.data?.result
  const likeMutation = uselikeMutation()
  const unlikeMutation = useUnLikeMutation()
  const bookmarkMutation = useBookmarkMutation()
  const unBookmarkMutation = useUnBookmarkMutation()
  const commentMutation = useCommentMutation()

  const handleLikeToggle = (tweet_id: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate(tweet_id, {
        onSuccess: () => {
          refetchFeed() // Refetch dữ liệu feed chính
          refetchRandomFeed() // Refetch dữ liệu feed ngẫu nhiên
        }
      })
    } else {
      likeMutation.mutate(
        {
          body: { tweet_id: tweet_id },
          access_token: accessToken
        },
        {
          onSuccess: () => {
            refetchFeed() // Refetch dữ liệu feed chính
            refetchRandomFeed() // Refetch dữ liệu feed ngẫu nhiên
          }
        }
      )
    }
  }
  const handleBookmarkToggle = (tweet_id: string, isLiked: boolean) => {
    if (isLiked) {
      unBookmarkMutation.mutate(tweet_id, {
        onSuccess: () => {
          refetchFeed() // Refetch dữ liệu feed chính
          refetchRandomFeed() // Refetch dữ liệu feed ngẫu nhiên
        }
      })
    } else {
      bookmarkMutation.mutate(
        {
          body: { tweet_id: tweet_id },
          access_token: accessToken
        },
        {
          onSuccess: () => {
            refetchFeed() // Refetch dữ liệu feed chính
            refetchRandomFeed() // Refetch dữ liệu feed ngẫu nhiên
          }
        }
      )
    }
  }

  const handleImageChange = (postId: string, index: number) => {
    setCurrentIndices((prevIndices) => ({
      ...prevIndices,
      [postId]: index
    }))
  }

  const handleNavigateToProfile = (userId: string) => {
    const { user_id: currentUserId } = decodeToken(accessToken)

    console.log('currentUserId:', currentUserId)
    console.log('userId:', userId)

    if (userId === currentUserId) {
      router.push('/account/profile')
    } else {
      router.push(`/${userId}`)
    }
  }

  const handleCommentSubmit = (tweet_id: string) => {
    const content = commentInput[tweet_id]
    const parent_id = parentId[tweet_id]

    if (!content) return

    commentMutation.mutate(
      {
        body: { tweet_id, content, parent_id },
        access_token: accessToken
      },
      {
        onSuccess: () => {
          setCommentInput({ ...commentInput, [tweet_id]: '' })
          refetchFeed() // Refetch lại dữ liệu để cập nhật danh sách bình luận
          refetchRandomFeed()
        }
      }
    )
  }
  const handleDirect = (id: string) => {
    router.push(`posts/${id}`)
  }

  const handleToggleDialog = (postId: string) => {
    setShowDialog((prev) => ({
      ...prev,
      [postId]: !prev[postId] // Toggle dialog cho từng post
    }))
  }

  return (
    <div className='flex flex-col items-center py-8'>
      {[...(feedData?.result || []), ...(randomFeedData?.result || [])].map((post) => (
        <div key={post._id} className='w-1/3 rounded overflow-hidden shadow-lg mb-8'>
          <div className='flex justify-between w-full cursor-pointer mb-3'>
            <div className='flex items-center space-x-4' onClick={() => handleNavigateToProfile(post.user._id)}>
              <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                <AvatarImage
                  className='w-full h-full object-cover'
                  src={post.user.avatar}
                  alt={`Avatar of ${post.user.name}`}
                />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <div className='text-base font-semibold text-black-900'>{post.user.name}</div>
                <div className='text-sm text-gray-500'>{post.user.username}</div>
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
                src={post.medias[currentIndices[post._id] || 0]?.url || ''}
                alt={`Slide ${currentIndices[post._id] + 1}`}
                layout='fill'
                objectFit='cover'
              />
            </div>

            <div className='flex justify-center mt-4 space-x-2'>
              {post.medias.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleImageChange(post._id, index)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                    currentIndices[post._id] === index ? 'bg-gray-800' : 'bg-gray-400'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <div className='flex justify-between items-center w-full cursor-pointer'>
              <div className='flex space-x-4'>
                <Heart
                  className={`w-6 h-6 ${
                    post.isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-white-800'
                  } transition-colors duration-300`}
                  onClick={() => handleLikeToggle(post._id, post.isLiked)}
                />
                <MessageCircle
                  onClick={() => handleDirect(post._id)}
                  className='w-6 h-6 text-white-800 cursor-pointer'
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Users
                      className={`w-6 h-6 cursor-pointer ${
                        post.mentions.length > 0 ? 'text-blue-500' : 'text-white-800'
                      }`}
                      onClick={() => handleToggleDialog(post._id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xem những người được tag</p>
                  </TooltipContent>
                </Tooltip>

                {/* Dialog hiển thị danh sách người được tag */}
                <Dialog open={showDialog[post._id] || false} onOpenChange={() => handleToggleDialog(post._id)}>
                  {post.mentions.length > 0 && ( // Kiểm tra nếu có người được tag
                    <DialogContent>
                      <div>
                        <h2 className='text-lg font-semibold mb-4'>Những người được tag vào bài viết</h2>
                        <ul>
                          {post.mentions.map((mention) => (
                            <div className='flex space-x-4 mb-4'>
                              <div>
                                <div
                                  onClick={() => handleNavigateToProfile(mention._id)}
                                  className='text-sm font-semibold cursor-pointer'
                                >
                                  {mention.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </ul>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
              <div>
                <Bookmark
                  className={`w-6 h-6 ${
                    post.isBookmarked ? 'fill-white text-white' : 'fill-none text-white-800'
                  } transition-colors duration-300`}
                  onClick={() => handleBookmarkToggle(post._id, post.isBookmarked)}
                />
              </div>
            </div>

            <div className=''>
              <div className='flex font-semibold text-sm'>
                <p className='ml-1'>{post.likes.toLocaleString()} lượt thích</p>
              </div>

              <div className='flex items-start mb-1'>
                <p
                  className='text-sm ml-1 break-words whitespace-pre-wrap cursor-pointer'
                  onClick={() => handleNavigateToProfile(post.user._id)}
                >
                  {post.user.username}
                </p>
                <span className='text-sm ml-1 break-words whitespace-pre-wrap flex-1'>{post.content}</span>
              </div>

              <Link href={`/posts/${post._id}`} className='text-sm text-gray-500 cursor-pointer '>
                View all comments
              </Link>
              <div className='flex items-center mb-2'>
                <input
                  className='text-sm text-gray-500 border-none outline-none w-full bg-transparent'
                  placeholder={parentId[post._id] ? `Reply to comment ${parentId[post._id]}...` : 'Add a comment...'}
                  value={commentInput[post._id] || ''}
                  onChange={(e) =>
                    setCommentInput({
                      ...commentInput,
                      [post._id]: e.target.value
                    })
                  }
                />
                {commentInput[post._id] && ( // Kiểm tra nếu có ký tự
                  <button className='ml-2 text-sm text-blue-500' onClick={() => handleCommentSubmit(post._id)}>
                    Đăng
                  </button>
                )}
              </div>
            </div>
          </div>
          <hr className='my-4 border-t border-gray-300 w-full' />
        </div>
      ))}
    </div>
  )
}
