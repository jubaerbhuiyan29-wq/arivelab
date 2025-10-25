'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImageGallery, ImageItem } from '@/components/ui/image-gallery'
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Star,
  FolderOpen,
  Image as ImageIcon,
  Calendar,
  HardDrive,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface FolderStats {
  name: string
  count: number
  totalSize: number
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [folderStats, setFolderStats] = useState<FolderStats[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/login')
      return
    }
    
    // Mock data for demonstration
    const mockImages: ImageItem[] = [
      {
        id: '1',
        url: '/uploads/profiles/1755290372418-Albert_Einstein_teaching.gif',
        title: 'Profile Picture',
        description: 'User profile image',
        fileSize: 1024000,
        fileType: 'image/gif',
        uploadedAt: '2024-01-15',
        isFeatured: true
      },
      {
        id: '2',
        url: '/uploads/profiles/1755372035137-Albert_Einstein_teaching.gif',
        title: 'Team Member Photo',
        description: 'Team member profile image',
        fileSize: 1024000,
        fileType: 'image/gif',
        uploadedAt: '2024-01-16',
        isFeatured: false
      },
      {
        id: '3',
        url: '/uploads/projects/project1.jpg',
        title: 'Project Screenshot',
        description: 'Main project screenshot',
        fileSize: 2048000,
        fileType: 'image/jpeg',
        uploadedAt: '2024-01-17',
        isFeatured: true
      }
    ]

    const mockStats: FolderStats[] = [
      { name: 'profiles', count: 15, totalSize: 15360000 },
      { name: 'projects', count: 8, totalSize: 8192000 },
      { name: 'research', count: 12, totalSize: 12288000 },
      { name: 'general', count: 5, totalSize: 5120000 }
    ]

    setImages(mockImages)
    setFilteredImages(mockImages)
    setFolderStats(mockStats)
    setLoading(false)
  }, [user, isAdmin, router])

  useEffect(() => {
    let filtered = images

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by folder
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(image => 
        image.url.includes(`/uploads/${selectedFolder}/`)
      )
    }

    setFilteredImages(filtered)
  }, [images, searchTerm, selectedFolder])

  const handleImageUpload = (imageUrl: string) => {
    const newImage: ImageItem = {
      id: Date.now().toString(),
      url: imageUrl,
      title: 'New Image',
      description: 'Recently uploaded',
      fileSize: 0,
      fileType: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
      isFeatured: false
    }

    setImages(prev => [newImage, ...prev])
    toast.success('Image uploaded successfully')
  }

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    toast.success('Image deleted successfully')
  }

  const handleImageFeature = (imageId: string, featured: boolean) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFeatured: featured } : img
    ))
    toast.success(featured ? 'Image marked as featured' : 'Image unfeatured')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTotalStats = () => {
    const totalImages = images.length
    const totalSize = images.reduce((sum, img) => sum + (img.fileSize || 0), 0)
    const featuredImages = images.filter(img => img.isFeatured).length
    return { totalImages, totalSize, featuredImages }
  }

  const { totalImages, totalSize, featuredImages } = getTotalStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-200">Loading image management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="mb-4 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Image Management
            </h1>
          </div>
          <p className="text-lg text-purple-200/80">Manage and organize your website images</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Images</CardTitle>
              <ImageIcon className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-100">{totalImages}</div>
              <p className="text-xs text-purple-200/60">All images</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Total Size</CardTitle>
              <HardDrive className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">{formatFileSize(totalSize)}</div>
              <p className="text-xs text-green-200/60">Storage used</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">Featured</CardTitle>
              <Star className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-100">{featuredImages}</div>
              <p className="text-xs text-yellow-200/60">Featured images</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">Folders</CardTitle>
              <FolderOpen className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-100">{folderStats.length}</div>
              <p className="text-xs text-cyan-200/60">Organized folders</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/80 border border-purple-500/30">
            <TabsTrigger value="upload" className="text-purple-200 data-[state=active]:bg-purple-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </TabsTrigger>
            <TabsTrigger value="manage" className="text-purple-200 data-[state=active]:bg-purple-600">
              <ImageIcon className="w-4 h-4 mr-2" />
              Manage Images
            </TabsTrigger>
            <TabsTrigger value="folders" className="text-purple-200 data-[state=active]:bg-purple-600">
              <FolderOpen className="w-4 h-4 mr-2" />
              Folder Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload New Image
                </CardTitle>
                <CardDescription className="text-purple-200/80">
                  Upload images to your website. Supported formats: PNG, JPG, GIF, WebP, SVG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  folder="general"
                  maxSize={10}
                  showPreview={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-purple-400 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Image Library
                    </CardTitle>
                    <CardDescription className="text-purple-200/80">
                      Browse, search, and manage your uploaded images
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-black/50 border-purple-500/30 text-purple-100 placeholder-purple-200/50"
                      />
                    </div>
                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="px-3 py-2 border border-purple-500/30 bg-black/50 text-purple-100 rounded-md text-sm"
                    >
                      <option value="all">All Folders</option>
                      {folderStats.map(folder => (
                        <option key={folder.name} value={folder.name}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  images={filteredImages}
                  onImageDelete={handleImageDelete}
                  onImageFeature={handleImageFeature}
                  deletable={true}
                  featureable={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="folders" className="space-y-6">
            <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Folder Statistics
                </CardTitle>
                <CardDescription className="text-purple-200/80">
                  View detailed statistics for each image folder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folderStats.map((folder) => (
                    <Card key={folder.name} className="bg-black/50 border-purple-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-purple-100">{folder.name}</h3>
                          <FolderOpen className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200/80">Images:</span>
                            <span className="text-purple-100">{folder.count}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200/80">Size:</span>
                            <span className="text-purple-100">{formatFileSize(folder.totalSize)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}