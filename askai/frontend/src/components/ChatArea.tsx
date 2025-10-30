import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Paperclip, Code, Mic, MicOff, Bot } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { useSettingsStore } from '../store/settingsStore'
import api from '../lib/api'
import MessageList from './MessageList'
import FileUpload from './FileUpload'
import CodeCanvas from './CodeCanvas'
import VoiceCall from './VoiceCall'

export default function ChatArea() {
  const { chatId } = useParams()
  const { messages, setMessages, addMessage } = useChatStore()
  const { agent_mode } = useSettingsStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showCodeCanvas, setShowCodeCanvas] = useState(false)
  const [showVoiceCall, setShowVoiceCall] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (chatId) {
      loadChat()
    } else {
      setMessages([])
    }
  }, [chatId])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const loadChat = async () => {
    try {
      const response = await api.get(`/chats/${chatId}`)
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error('Failed to load chat:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !chatId || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to UI
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: userMessage,
      created_at: new Date().toISOString()
    }
    addMessage(userMsg)

    try {
      // Send message with uploaded file IDs
      const fileIds = uploadedFiles.map(f => f.id)
      const response = await api.post(`/ai/chat/${chatId}`, {
        message: userMessage,
        fileIds: fileIds.length > 0 ? fileIds : undefined
      })

      addMessage({
        ...response.data,
        created_at: new Date().toISOString()
      })

      // Clear uploaded files after sending
      setUploadedFiles([])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUploaded = (file: any) => {
    setUploadedFiles([...uploadedFiles, file])
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId))
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to AskAI
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start a new chat or select an existing one
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} loading={loading} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {agent_mode && (
          <div className="mb-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Agent Mode Active
            </span>
          </div>
        )}

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                <Paperclip className="w-4 h-4" />
                <span className="text-sm">{file.filename}</span>
                <button onClick={() => removeFile(file.id)} className="text-red-600 hover:text-red-700">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title="Upload File"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowCodeCanvas(!showCodeCanvas)}
              className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title="Code Canvas"
            >
              <Code className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowVoiceCall(!showVoiceCall)}
              className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              title="Voice Call"
            >
              {showVoiceCall ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none resize-none max-h-32"
            rows={1}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Modals */}
      {showFileUpload && (
        <FileUpload
          chatId={chatId}
          onFileUploaded={handleFileUploaded}
          onClose={() => setShowFileUpload(false)}
        />
      )}
      {showCodeCanvas && (
        <CodeCanvas
          chatId={chatId}
          onClose={() => setShowCodeCanvas(false)}
        />
      )}
      {showVoiceCall && (
        <VoiceCall onClose={() => setShowVoiceCall(false)} />
      )}
    </div>
  )
}
