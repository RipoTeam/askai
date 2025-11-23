import { useState } from 'react'
import { X, Download, Save } from 'lucide-react'
import api from '../lib/api'

interface CodeCanvasProps {
  chatId: string
  onClose: () => void
}

export default function CodeCanvas({ chatId, onClose }: CodeCanvasProps) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [title, setTitle] = useState('Untitled')

  const handleSave = async () => {
    try {
      await api.post(`/canvas/${chatId}`, { title, language, code })
      alert('Canvas saved!')
    } catch (error) {
      console.error('Failed to save canvas:', error)
    }
  }

  const handleDownload = () => {
    const ext = language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.${ext}`
    a.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl w-full h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold bg-transparent border-none outline-none"
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 resize-none outline-none"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  )
}
