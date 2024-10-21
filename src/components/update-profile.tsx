'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { useAccountQuery, useUpdateMeMutation } from '@/queries/useAccount'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const UpdateMeSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  data_of_birth: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  username: z.string().optional(),
  cover_photo: z.string().optional()
})

export type UpdateMeFormValues = z.infer<typeof UpdateMeSchema>

export default function UpdateProfileForm() {
  const updateMeMutation = useUpdateMeMutation()
  const uploadMediaMutation = useUploadMediaMutation()

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { data, refetch } = useAccountQuery()
  const route = useRouter()

  const form = useForm<UpdateMeFormValues>({
    resolver: zodResolver(UpdateMeSchema),
    defaultValues: {
      name: '',
      avatar: '',
      data_of_birth: '',
      bio: '',
      location: '',
      website: '',
      username: '',
      cover_photo: ''
    }
  })

  useEffect(() => {
    if (data) {
      const { name, avatar, username } = data.result
      form.reset({
        name,
        avatar: avatar,
        username
      })
    }
  }, [data, form])

  const avatar = form.watch('avatar')
  const name = form.watch('name')

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [avatar, file])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: UpdateMeFormValues) => {
    if (updateMeMutation.isPending) {
      return
    }

    let body: UpdateMeFormValues = { ...values }

    try {
      if (file) {
        const formData = new FormData()
        formData.append('image', file)

        // Upload image and get URL
        const imageUrl = await uploadMediaMutation.mutateAsync(formData)

        body.avatar = imageUrl.result[0].url
      }

      const result = await updateMeMutation.mutateAsync(body)

      toast({
        description: 'Cập nhật thành công'
      })
      route.back()
      refetch()
    } catch (error) {
      console.error('Error during form submission:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                      </Avatar>
                      <Input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0]
                          if (selectedFile) {
                            setFile(selectedFile)
                            field.onChange(URL.createObjectURL(selectedFile))
                          }
                        }}
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='username'>Tên người dùng</Label>
                      <Input id='username' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className='items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
