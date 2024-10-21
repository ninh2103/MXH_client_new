'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent className='sm:max-w-[800px] lg:max-w-[1000px] w-full h-auto'>{children}</DialogContent>
    </Dialog>
  )
}
