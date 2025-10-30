import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MessageSquare, Plus, Settings, LogOut, Trash2, Edit2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import api from '../lib/api'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { chats, currentChat, setChats, setCurrentChat, addChat, deleteChat } = useChatStore()
  const navigate = useNavigate()
  const { chatId } = useParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId)
    }
  }, [chatId])

  const loadChats = async () => {
    try {
      const response = await api.get('/chats')
      setChats(response.data)
    } catch (error) {
      console.error('Failed to load chats:', error)
    }
  }

  const handleNewChat = async () => {
    setLoading(true)
    try {
      const response = await api.post('/chats', { title: 'New Chat' })
      addChat(response.data)
      navigate(`/c/${response.data.id}`)
    } catch (error) {
      console.error('Failed to create chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Delete this chat?')) return

    try {
      await api.delete(`/chats/${id}`)
      deleteChat(id)
      if (currentChat === id) {
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewChat}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/c/${chat.id}`}
            className={`group flex items-center gap-3 p-3 rounded-lg mb-1 transition ${
              currentChat === chat.id
                ? 'bg-gray-100 dark:bg-gray-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate">
              {chat.title}
            </span>
            <button
              onClick={(e) => handleDeleteChat(chat.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </button>
          </Link>
        ))}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/settings"
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600 dark:text-red-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
