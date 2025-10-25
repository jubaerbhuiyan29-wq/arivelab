'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Image as ImageIcon, Download, Eye, Trash2, Star } from 'lucide-react'
import Image from 'next/image'

interface ImageItem {
  id: string
  url: string
  title?: string
  description?: string
  fileSize?: number
  fileType?: string
  uploadedAt?: string
  isFeatured?: boolean
}

interface ImageGalleryProps {
  images: ImageItem[]
  onImageSelect?: (image: ImageItem) => void
  onImageDelete?: (imageId: string) => void
  onImageFeature?: (imageId: string, featured: boolean) => void
  selectable?: boolean
  deletable?: boolean
  featureable?: boolean
  maxImages?: number
  className?: string
}

export function ImageGallery({
  images,
  onImageSelect,
  onImageDelete,
  onImageFeature,
  selectable = false,
  deletable = false,
  featureable = false,
  maxImages,
  className = ''
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null)

  const handleImageClick = (image: ImageItem) => {
    if (selectable) {
      setSelectedImage(selectedImage === image.id ? null : image.id)
      onImageSelect?.(image)
    } else {
      setPreviewImage(image)
    }
  }

  const handleDelete = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onImageDelete?.(imageId)
  }

  const handleFeature = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const image = images.find(img => img.id === imageId)
    if (image) {
      onImageFeature?.(imageId, !image.isFeatured)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (images.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images uploaded yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
              selectedImage === image.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleImageClick(image)}
          >
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.title || 'Image'}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewImage(image)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <div className="space-y-4">
                          <div className="aspect-video relative">
                            <Image
                              src={image.url}
                              alt={image.title || 'Image'}
                              fill
                              className="object-contain"
                            />
                          </div>
                          {image.title && (
                            <h3 className="text-lg font-semibold">{image.title}</h3>
                          )}
                          {image.description && (
                            <p className="text-gray-600">{image.description}</p>
                          )}
                          <div className="flex gap-4 text-sm text-gray-500">
                            {image.fileSize && (
                              <span>{formatFileSize(image.fileSize)}</span>
                            )}
                            {image.fileType && (
                              <span>{image.fileType}</span>
                            )}
                            {image.uploadedAt && (
                              <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        const link = document.createElement('a')
                        link.href = image.url
                        link.download = image.title || 'image'
                        link.click()
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {featureable && (
                      <Button
                        variant={image.isFeatured ? "default" : "secondary"}
                        size="sm"
                        onClick={(e) => handleFeature(image.id, e)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}

                    {deletable && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => handleDelete(image.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Featured badge */}
                {image.isFeatured && (
                  <Badge className="absolute top-2 left-2">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}

                {/* Selection indicator */}
                {selectable && selectedImage === image.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Image info */}
              <div className="p-3">
                {image.title && (
                  <h4 className="font-medium text-sm truncate">{image.title}</h4>
                )}
                {image.description && (
                  <p className="text-xs text-gray-500 truncate">{image.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {maxImages && images.length >= maxImages && (
        <div className="mt-4 text-center">
          <Badge variant="secondary">
            Maximum images reached ({images.length}/{maxImages})
          </Badge>
        </div>
      )}
    </div>
  )
}