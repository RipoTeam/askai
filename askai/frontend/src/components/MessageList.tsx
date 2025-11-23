import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface MessageListProps {
  messages: Message[]
  loading: boolean
}

const syntaxTheme = vscDarkPlus as unknown as { [key: string]: CSSProperties }

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const { inline, ...rest } = props as { inline?: boolean }
    const match = /language-(\w+)/.exec(className || '')

    return !inline && match ? (
      <SyntaxHighlighter
        style={syntaxTheme}
        language={match[1]}
        PreTag="div"
        {...rest}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...rest}>
        {children}
      </code>
    )
  },
}

export default function MessageList({ messages, loading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div
            className={`flex-1 max-w-3xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3'
                : 'bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {message.role === 'assistant' ? (
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={markdownComponents}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {message.role === 'user' && (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-gray-700">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
