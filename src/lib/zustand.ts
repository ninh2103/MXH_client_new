import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ConversationType } from '@/types/conversation'

interface MessageStore {
  activeSection: string
  selectedUserId: string | null
  setActiveSection: (section: string) => void
  setSelectedUserId: (userId: string | null) => void
}

export const useMessageStore = create<MessageStore>()(
  devtools((set) => ({
    activeSection: 'home',
    selectedUserId: null,
    setActiveSection: (section) => set({ activeSection: section }),
    setSelectedUserId: (userId) => set({ selectedUserId: userId })
  }))
)

interface DashboardState {
  activeSection: string
  selectedUserId: string | null
  value: string
  conversations: ConversationType[]
  receiver: string
  pagination: {
    page: number
    total_page: number
  }
  setActiveSection: (section: string) => void
  setSelectedUserId: (userId: string | null) => void
  setValue: (value: string) => void
  setConversations: (conversations: ConversationType[]) => void
  setReceiver: (receiver: string) => void
  setPagination: (pagination: { page: number; total_page: number }) => void
}

const useStore = create<DashboardState>((set) => ({
  activeSection: 'home',
  selectedUserId: null,
  value: '',
  conversations: [],
  receiver: '',
  pagination: {
    page: 1,
    total_page: 0
  },
  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  setValue: (value) => set({ value }),
  setConversations: (conversations) => set({ conversations }),
  setReceiver: (receiver) => set({ receiver }),
  setPagination: (pagination) => set({ pagination })
}))

export default useStore
