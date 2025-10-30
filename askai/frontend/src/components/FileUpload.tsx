import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File, CheckCircle } from 'lucide-react'
import api from '../lib/api'

interface FileUploadProps {
  chatId: string
  onFileUploaded: (file: any) => void
  onClose: () => void
}

export default function FileUpload({ chatId, onFileUploaded, onClose }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post(`/files/upload/${chatId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setUploadedFile(response.data)
      onFileUploaded(response.data)
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }, [chatId, onFileUploaded, onClose])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload File</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadedFile ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              File Uploaded!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {uploadedFile.filename}
            </p>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-600'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div>
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 dark:text-white font-medium mb-2">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop a file here'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  or click to browse (max 10MB)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Supports: PDF, DOCX, TXT, Images, Code files
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
