import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { setAuthToken } from '../lib/api'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import Settings from '../components/Settings'

export default function Chat() {
  const { token } = useAuthStore()
  const { theme } = useSettingsStore()

  useEffect(() => {
    if (token) {
      setAuthToken(token)
    }

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [token, theme])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Routes>
        <Route path="/" element={<ChatArea />} />
        <Route path="/c/:chatId" element={<ChatArea />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
