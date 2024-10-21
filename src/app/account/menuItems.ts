import React from 'react'
import { Home, Search as SearchIcon, Heart, MessageCircle, PlusCircle, SquareUser } from 'lucide-react'
import search from '@/components/search'
import notication from '@/components/notication'
import create from '@/components/create'

export type MenuItem = {
  title: string
  Icon: React.ElementType
  href: string
  component?: React.ComponentType
}

const menuItems: MenuItem[] = [
  {
    title: 'Trang chủ',
    Icon: Home,
    href: '/',
    component: undefined
  },
  {
    title: 'Tìm kiếm',
    Icon: SearchIcon,
    href: '',
    component: search
  },
  {
    title: 'Thông báo',
    Icon: Heart,
    href: '',
    component: notication
  },
  {
    title: 'Tin nhắn',
    Icon: MessageCircle,
    href: '/account/message/',
    component: undefined
  },
  {
    title: 'Tạo',
    Icon: PlusCircle,
    href: '',
    component: create
  },
  {
    title: 'Trang cá nhân',
    Icon: SquareUser,
    href: '/account/profile',
    component: undefined
  }
]

export default menuItems
