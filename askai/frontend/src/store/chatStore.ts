import { create } from 'zustand'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatState {
  chats: Chat[]
  currentChat: string | null
  messages: Message[]
  setChats: (chats: Chat[]) => void
  setCurrentChat: (chatId: string | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  addChat: (chat: Chat) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  deleteChat: (chatId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChat: null,
  messages: [],
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat => chat.id === chatId ? { ...chat, ...updates } : chat)
  })),
  deleteChat: (chatId) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== chatId),
    currentChat: state.currentChat === chatId ? null : state.currentChat
  })),
}))
