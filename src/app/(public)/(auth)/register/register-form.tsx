'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { useRegisterMutation } from '@/queries/useAuth'
import { RegisterBodyType } from '@/types/auth'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const registerMutation = useRegisterMutation()
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      date_of_birth: '',
      password: '',
      comfim_password: '',
      name: ''
    }
  })

  const onSubmit = async (body: RegisterBodyType) => {
    if (registerMutation.isPending) return
    try {
      const data = await registerMutation.mutateAsync(body)
      console.log('data:', data)
      const { access_token, refresh_token } = data.result

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      toast({
        description: data.message
      })

      router.push('/login')
    } catch (error: any) {
      console.log('lỗi', error)
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng Kí</CardTitle>
        <CardDescription>Điền thông tin của bạn vào form để đăng kí tài khoản.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Mật khẩu</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='comfim_password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='comfirm_password'>Nhập lại mật khẩu</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='date_of_birth'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='data_of_birth'>Ngày sinh</Label>
                      </div>
                      <Input id='date' type='date' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='name'>Tên</Label>
                      </div>
                      <Input id='text' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng Kí
              </Button>
              <div className='flex'>
                <Link href={`#`} className='w-1/3 text-center'>
                  Đăng nhập
                </Link>
                <Link href={''} className='w-2/3 text-center'>
                  Đăng nhập bằng Google
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
