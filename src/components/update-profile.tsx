'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Checkbox } from '@/components/ui/checkbox'

export default function EditProfile() {
  const [open, setOpen] = useState(false)
  const form = useForm({
    defaultValues: {
      name: '',
      avatar: '',
      bio: '',
      gender: ''
    }
  })

  return (
    <Form {...form}>
      <form noValidate className='grid max-w-5xl auto-rows-max items-start gap-4 md:gap-8'>
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
                        <AvatarImage src={field.value} alt='Avatar' />
                        <AvatarFallback className='rounded-none'>N/A</AvatarFallback>
                      </Avatar>
                      <Input type='file' accept='image/*' className='hidden' {...field} />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
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
                      <Input id='name' type='text' className='w-[500px]' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='bio'>Tiểu sử</Label>
                      <Input id='bio' type='text' className='w-[500px]' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={open}
                          className='w-[500px] justify-between'
                        >
                          {field.value || 'Giới Tính'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-[500px]'>
                        <Command>
                          <CommandList>
                            <div className='flex items-center space-x-2'>
                              <Checkbox
                                id='male'
                                className='h-6 w-6'
                                checked={field.value === 'Nam'}
                                onCheckedChange={() => field.onChange('Nam')}
                              />
                              <label
                                htmlFor='male'
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              >
                                Nam
                              </label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Checkbox
                                id='female'
                                className='h-6 w-6'
                                checked={field.value === 'Nữ'}
                                onCheckedChange={() => field.onChange('Nữ')}
                              />
                              <label
                                htmlFor='female'
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              >
                                Nữ
                              </label>
                            </div>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
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
