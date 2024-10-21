'use client'

import { useRef, useState } from 'react'
import { useGetDetailQuery } from '@/queries/usePost'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon, Bookmark, Eye, Heart, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetProfileQuery } from '@/queries/useAccount'
import { useCommentMutation, useGetCommentQuery } from '@/queries/useComment'
import { differenceInHours } from 'date-fns'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { uselikeMutation, useUnLikeMutation } from '@/queries/useLike'
import { useBookmarkMutation, useUnBookmarkMutation } from '@/queries/usebookmark'
import { usePathname } from 'next/navigation'

interface PostDetailProps {
  tweet_id: string
}
const LIMIT = 10
const PAGE = 1

const Comment = ({ comment, handleReply, showReplies, toggleReplies }: any) => {
  return (
    <div key={comment._id} className={`flex items-start space-x-2 mb-3 ${comment.parent_id ? 'ml-8' : ''}`}>
      <Avatar className='w-8 h-8 rounded-full overflow-hidden'>
        <AvatarImage className='w-full h-full object-cover' src={comment.userDetails.avatar} />
        <AvatarFallback>{comment.userDetails.username}</AvatarFallback>
      </Avatar>
      <div className='items-center space-x-1 flex-1'>
        <p className='text-sm text-black font-semibold'>{comment.userDetails.name}</p>
        <div className='flex'>
          <p className='text-xs text-black text-muted-foreground'>
            {differenceInHours(new Date(), new Date(comment.created_at))} giờ trước
          </p>
          <p
            className='text-xs text-blue-500 text-muted-foreground ml-2 cursor-pointer'
            onClick={() => handleReply(comment)}
          >
            trả lời
          </p>
          <p className='text-sm text-black text-muted-foreground ml-2 cursor-pointer'>...</p>
        </div>
        <p className='text-sm text-black ml-1 break-words whitespace-pre-wrap flex-1'>{comment.content}</p>
        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <p className='text-xs text-blue-500 cursor-pointer ml-2' onClick={() => toggleReplies(comment._id)}>
            {showReplies ? 'Ẩn câu trả lời' : 'Xem câu trả lời'}
          </p>
        )}
        {showReplies && (
          <div className='ml-8'>
            {comment.replies.map((reply: any) => (
              <Comment
                key={reply._id}
                comment={reply}
                handleReply={handleReply}
                showReplies={false} // Do not show replies for replies
                toggleReplies={() => {}} // No toggle for replies in this case
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostDetail({ tweet_id }: PostDetailProps) {
  const accessToken = getAccessTokenFromLocalStorage() as string
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({})
  const [parentId, setParentId] = useState<{ [key: string]: string | null }>({})
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({})

  const { data, refetch } = useGetDetailQuery(tweet_id)
  const accountQuery = useGetProfileQuery(data?.result.user_id || '')
  const users = accountQuery.data?.result

  const getCommentQuery = useGetCommentQuery(tweet_id, LIMIT, PAGE)
  const commentMutation = useCommentMutation()
  const likeMutation = uselikeMutation()
  const unlikeMutation = useUnLikeMutation()
  const bookmarkMutation = useBookmarkMutation()
  const unBookmarkMutation = useUnBookmarkMutation()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const comments = getCommentQuery.data?.result || []

  const [currentIndex, setCurrentIndex] = useState(0)

  if (!data || !data.result || !data.result.medias || data.result.medias.length === 0) {
    return null
  }

  const totalImages = data.result.medias.length

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalImages - 1 : prevIndex - 1))
  }

  const handleCommentSubmit = (tweet_id: string) => {
    const content = commentInput[tweet_id]
    const parent_id = parentId[tweet_id] || null

    if (!content) return

    commentMutation.mutate(
      {
        body: { tweet_id, content, parent_id },
        access_token: accessToken
      },
      {
        onSuccess: () => {
          setCommentInput({ ...commentInput, [tweet_id]: '' })
          setParentId({ ...parentId, [tweet_id]: null })
          refetch()
        }
      }
    )
  }

  const handleReply = (comment: any) => {
    setCommentInput((prev) => ({
      ...prev,
      [data.result._id]: `@${comment.userDetails.name} ` // Dùng ID tweet chính để lưu input
    }))
    setParentId((prev) => ({
      ...prev,
      [data.result._id]: comment._id // Đặt parent_id cho comment
    }))
  }

  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  // Separate parent comments and replies
  const parentComments = comments.filter((comment) => !comment.parent_id)
  const childComments = comments.filter((comment) => comment.parent_id)

  // Group replies under their respective parent comments
  const commentsWithReplies = parentComments.map((comment) => ({
    ...comment,
    replies: childComments.filter((reply) => reply.parent_id === comment._id)
  }))

  const handleLikeToggle = (tweet_id: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate(tweet_id, {
        onSuccess: () => {
          refetch()
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
            refetch()
          }
        }
      )
    }
  }
  const handleBookmarkToggle = (tweet_id: string, isLiked: boolean) => {
    if (isLiked) {
      unBookmarkMutation.mutate(tweet_id, {
        onSuccess: () => {
          refetch()
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
            refetch()
          }
        }
      )
    }
  }
  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className='flex items-center justify-center h-[700px] bg-gray-900'>
      <div className='relative flex items-center'>
        <div className='flex'>
          <div className='relative w-[343px] h-[500px] bg-white'>
            {data.result.medias.map((media: { url: string }, index: number) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image src={media.url} alt={`Media ${index + 1}`} layout='fill' objectFit='contain' className='block' />
              </div>
            ))}

            {totalImages > 1 && (
              <>
                <Button
                  onClick={handlePrev}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-300 z-10'
                >
                  <ArrowLeftIcon className='w-2 h-2' />
                </Button>

                <Button
                  onClick={handleNext}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-300 z-10'
                >
                  <ArrowRightIcon className='w-2 h-2' />
                </Button>
              </>
            )}
          </div>

          <div className='bg-white w-[500px] h-[500px] relative'>
            <div className='absolute top-4 left-4 flex items-center space-x-4'>
              <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                <AvatarImage className='w-full h-full object-cover' src={users?.avatar} />
                <AvatarFallback>{users?.name}</AvatarFallback>
              </Avatar>
              <div className='space-y-1 flex items-center'>
                <div className='flex-shrink-0'>
                  <p className='text-sm text-black font-semibold leading-none'>{users?.name}</p>
                  <p className='text-xs text-black text-muted-foreground'>{users?.username}</p>
                </div>

                {/* Đường phân cách dọc */}
                <div className='ml-1 border-l border-black h-full mx-4'>-</div>

                <p className='text-black font-serif text-sm'>{data.result.content}</p>
              </div>
            </div>

            <div className='absolute top-20 left-4 right-4'>
              <hr className='border-t border-black' />
            </div>

            {/* Comments Section */}
            <div className='absolute top-24 left-4 right-4 overflow-y-auto h-[300px]'>
              {commentsWithReplies.length === 0 ? (
                <p className='text-black text-sm'>Chưa có bình luận nào.</p>
              ) : (
                commentsWithReplies.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    handleReply={handleReply}
                    showReplies={expandedComments[comment._id]}
                    toggleReplies={toggleReplies}
                  />
                ))
              )}
            </div>

            <div className='absolute bottom-5 left-4 right-4'>
              <div className='flex justify-between items-center mt-3'>
                <div className='flex justify-between'>
                  <Heart
                    className={`w-6 h-6 ${
                      data.result.isLike ? 'fill-red-500 text-black' : 'fill-none text-black'
                    } transition-colors duration-300`}
                    onClick={() => handleLikeToggle(data.result._id, data.result.isLike)}
                  />
                  <MessageCircle onClick={handleIconClick} className='w-6 h-6 text-black cursor-pointer ml-2' />
                </div>

                <div className='flex'>
                  <div className='flex'>
                    <p className='text-black font-bold text-sm'>{data.result.view} </p>
                    <Eye className='text-black mr-2' />
                  </div>

                  <Bookmark
                    className={`w-6 h-6  ${
                      data.result.isBookmark ? 'text-black fill-stone-900' : '  fill-white text-black'
                    } transition-colors duration-300`}
                    onClick={() => handleBookmarkToggle(data.result._id, data.result.isBookmark)}
                  />
                </div>
              </div>

              <hr className='border-t border-black' />
              <div className='flex mt-2 '>
                <input
                  ref={inputRef}
                  className='text-sm text-gray-500 border-none outline-none w-full bg-transparent'
                  placeholder='Add a comment...'
                  value={commentInput[data.result._id] || ''}
                  onChange={(e) =>
                    setCommentInput((prev) => ({
                      ...prev,
                      [data.result._id]: e.target.value
                    }))
                  }
                />

                {commentInput[data.result._id] && (
                  <button className='ml-2 text-sm text-blue-500' onClick={() => handleCommentSubmit(data.result._id)}>
                    Đăng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
