'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useSearchParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { useDeletePostMutation, useGetPostList } from '@/queries/usePost'
import { columnsType, GetNewFeedsResponse, PostType } from '@/types/post'
import { createContext, useContext, useEffect, useState } from 'react'

type PostItem = GetNewFeedsResponse['result'][0]

const PostTableContext = createContext<{
  postDelete: PostItem | null
  setpostDelete: (value: PostItem | null) => void
}>({
  postDelete: null,
  setpostDelete: (value: PostItem | null) => {}
})

export const columns: ColumnDef<columnsType>[] = [
  {
    accessorKey: 'stt',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div>
  },
  {
    accessorKey: 'medias',
    header: 'Ảnh',
    cell: ({ row }) => {
      const medias = row.getValue('medias')
      const mediaUrl = Array.isArray(medias) && medias.length > 0 ? medias[0].url : null

      return (
        <div>
          {mediaUrl ? (
            <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
              <AvatarImage src={mediaUrl} />
              <AvatarFallback className='rounded-none'>{row.original._id}</AvatarFallback>
            </Avatar>
          ) : (
            <p>No image</p>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'content',
    header: 'Nội Dung',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('content')}</div>
  },
  {
    accessorKey: 'created_at',
    header: 'Ngày Tạo',
    cell: ({ row }) => {
      const rawDate = row.getValue('created_at')
      const formattedDate = rawDate ? new Date(rawDate as Date).toLocaleDateString('vi-VN') : 'Không xác định'

      return <div className='capitalize'>{formattedDate}</div>
    }
  },
  {
    id: 'actions',
    header: 'Action',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setpostDelete } = useContext(PostTableContext)

      const openDeletePost = () => {
        setpostDelete(row.original as PostItem)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openDeletePost}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeletePost({
  postDelete,
  setpostDelete
}: {
  postDelete: PostItem | null
  setpostDelete: (value: PostItem | null) => void
}) {
  const { mutateAsync } = useDeletePostMutation()

  const deletePost = async () => {
    if (postDelete) {
      try {
        const result = await mutateAsync(postDelete._id)
        setpostDelete(null)
        toast({
          title: result.message
        })
      } catch (error) {}
    }
  }

  return (
    <AlertDialog
      open={Boolean(postDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setpostDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
          <AlertDialogDescription>
            Bài viết với nội dung{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {`"${postDelete?.content}"`} của người dùng {postDelete?.user.name}
            </span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePost}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const PAGE_SIZE = 10

export default function PostTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [postDelete, setpostDelete] = useState<PostItem | null>(null)
  const postListQuery = useGetPostList(PAGE_SIZE, page)
  const data = postListQuery.data?.result ?? []

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <PostTableContext.Provider
      value={{
        postDelete,
        setpostDelete
      }}
    >
      <div className='w-full'>
        <AlertDialogDeletePost postDelete={postDelete} setpostDelete={setpostDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter content...'
            value={(table.getColumn('content')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('content')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PostTableContext.Provider>
  )
}
