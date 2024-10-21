'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLoginMutation } from '@/queries/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import useCheck from '@/queries/useCheck'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' })
})

type LoginFormInputs = z.infer<typeof loginSchema>

export default function LoginForm() {
  useCheck()
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (body: LoginFormInputs) => {
    if (loginMutation.isPending) return
    try {
      const data = await loginMutation.mutateAsync(body)
      console.log('data:', data)
      const { access_token, refresh_token } = data.result

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      toast({
        description: data.message
      })

      router.push('/')
    } catch (error: any) {
      console.log('lỗi', error)
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className='grid gap-4'>
              {/* Email field */}
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

              {/* Password field */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>

              <div className='flex'>
                <Link href={`/register`} className='w-1/2 text-center'>
                  Đăng kí
                </Link>
                <Link href={`/forgotpassword`} className='w-1/2 text-center'>
                  Quên mật khẩu ?
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
