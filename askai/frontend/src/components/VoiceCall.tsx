import { useState, useEffect, useRef } from 'react'
import { X, Mic, MicOff } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface VoiceCallProps {
  onClose: () => void
}

export default function VoiceCall({ onClose }: VoiceCallProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    const socketUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5000'
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket) {
          socket.emit('voice:audio', { audio: event.data })
        }
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
      socket?.emit('voice:start', { userId: Date.now() })
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      socket?.emit('voice:stop', { userId: Date.now() })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Voice Call</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isRecording ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
          }`}>
            {isRecording ? <MicOff className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isRecording ? 'Recording...' : 'Click to start voice call'}
          </p>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-8 py-3 rounded-lg font-medium transition ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRecording ? 'End Call' : 'Start Call'}
          </button>
        </div>
      </div>
    </div>
  )
}
