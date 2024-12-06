import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { decodeToken, getAccessTokenFromLocalStorage } from '@/lib/utils'
import { useGetPostVideoList } from '@/queries/usePost'
import { useRouter } from 'next/navigation'

const LIMIT = 10
const PAGE = 1

export default function Reels() {
  // Lấy dữ liệu video từ API
  const accessToken = getAccessTokenFromLocalStorage() as string
  const router = useRouter()
  const getPostVideoList = useGetPostVideoList(LIMIT, PAGE)
  const data = getPostVideoList.data?.result || []

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

  return (
    <div className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
      <main className='flex h-[480px] flex-1 flex-col overflow-hidden'>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>Reels</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Thướt Phim</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0'>
          {data.map((video, i) => (
            <div key={i} className='relative max-w-3xl bg-white p-4 rounded-xl shadow-md space-y-4'>
              {/* User Info */}
              <div
                className='flex items-center space-x-4 cursor-pointer'
                onClick={() => handleNavigateToProfile(video.user._id)}
              >
                <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
                  <AvatarImage className='w-full h-full object-cover' src={video?.user.avatar} alt={video?.user.name} />
                  <AvatarFallback>{video?.user.name}</AvatarFallback>
                </Avatar>
                <div className='text-gray-900'>
                  <div className='text-lg font-semibold'>{video?.user.name}</div>
                  <div className='text-sm font-mono'>
                    {video?.created_at
                      ? new Date(video.created_at).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                        })
                      : 'Unknown date'}
                  </div>
                </div>
              </div>
              <div
                className='text-sm text-black font-semibold truncate'
                title={video.content} // Hiển thị toàn bộ nội dung khi hover
              >
                {video.content}
              </div>

              {/* Video */}
              {video?._id ? (
                <div className='w-full bg-white rounded-lg overflow-hidden'>
                  <video
                    className='w-full h-[500px] object-cover rounded-lg'
                    style={{
                      maxHeight: '400px', // Giới hạn chiều cao
                      aspectRatio: '16/9' // Tỷ lệ 16:9
                    }}
                    controls
                  >
                    <source src={video?.medias[0].url} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <p>No video available</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
