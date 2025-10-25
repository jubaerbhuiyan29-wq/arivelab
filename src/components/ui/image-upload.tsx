'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Image as ImageIcon, FileImage, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  onImageRemove?: () => void
  currentImage?: string
  folder?: string
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
  showPreview?: boolean
  multiple?: boolean
}

export function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  folder = 'general',
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  className = '',
  showPreview = true,
  multiple = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File too large. Maximum size is ${maxSize}MB.`)
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', folder)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onImageUpload(data.imageUrl)
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
    
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showPreview && currentImage && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="relative group">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={currentImage}
                  alt="Current image"
                  fill
                  className="object-cover"
                />
              </div>
              {onImageRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Uploading...</p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FileImage className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {acceptedTypes.join(', ')} up to {maxSize}MB
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">GIF</Badge>
                <Badge variant="secondary">WebP</Badge>
                <Badge variant="secondary">SVG</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}