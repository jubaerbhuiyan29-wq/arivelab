'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Save,
  X,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast, ToastContainer } from '@/hooks/useToast'

interface ResearchItem {
  id: string
  title: string
  description: string
  excerpt?: string
  content?: string
  featured: boolean
  published: boolean
  categoryId?: string
  authorId?: string
  tags?: string
  readTime?: number
  difficulty?: string
  language?: string
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    name?: string
    email: string
  }
  category?: {
    id: string
    name: string
  }
  images?: {
    id: string
    imageUrl: string
    altText?: string
    caption?: string
    displayOrder: number
    isFeatured: boolean
  }[]
  metadata?: {
    methodology?: string
    findings?: string
    implications?: string
    references?: string
    doi?: string
    journal?: string
    volume?: string
    issue?: string
    pages?: string
    publisher?: string
  }
}

interface Category {
  id: string
  name: string
  type: string
}

interface FormData {
  title: string
  description: string
  excerpt: string
  content: string
  published: boolean
  featured: boolean
  categoryId: string
  tags: string
  readTime: number
  difficulty: string
  language: string
  images: {
    id?: string
    imageUrl: string
    altText: string
    caption: string
    displayOrder: number
    isFeatured: boolean
  }[]
  metadata: {
    methodology: string
    findings: string
    implications: string
    references: string
    doi: string
    journal: string
    volume: string
    issue: string
    pages: string
    publisher: string
  }
}

export default function AdminResearchPage() {
  const [research, setResearch] = useState<ResearchItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    excerpt: '',
    content: '',
    published: false,
    featured: false,
    categoryId: '',
    tags: '',
    readTime: 5,
    difficulty: '',
    language: 'English',
    images: [],
    metadata: {
      methodology: '',
      findings: '',
      implications: '',
      references: '',
      doi: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      publisher: ''
    }
  })
  const [isCreating, setIsCreating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState('basic') // basic, images, metadata
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()
  const { toast, toasts, dismiss } = useToast()

  const filteredResearch = Array.isArray(research) ? research.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/login')
        return
      }
      fetchData()
    }
  }, [user, authLoading, isAdmin, router])

  const fetchData = async () => {
    try {
      // Fetch research data
      const researchResponse = await fetch('/api/dashboard/research')
      if (researchResponse.ok) {
        const researchData = await researchResponse.json()
        setResearch(researchData)
      } else {
        setError('Failed to fetch research data')
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories?type=RESEARCH')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: ResearchItem) => {
    setEditingItem(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      excerpt: item.excerpt || '',
      content: item.content || '',
      published: item.published,
      featured: item.featured,
      categoryId: item.categoryId || '',
      tags: item.tags || '',
      readTime: item.readTime || 5,
      difficulty: item.difficulty || '',
      language: item.language || 'English',
      images: item.images || [],
      metadata: {
        methodology: item.metadata?.methodology || '',
        findings: item.metadata?.findings || '',
        implications: item.metadata?.implications || '',
        references: item.metadata?.references || '',
        doi: item.metadata?.doi || '',
        journal: item.metadata?.journal || '',
        volume: item.metadata?.volume || '',
        issue: item.metadata?.issue || '',
        pages: item.metadata?.pages || '',
        publisher: item.metadata?.publisher || ''
      }
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      title: '',
      description: '',
      excerpt: '',
      content: '',
      published: false,
      featured: false,
      categoryId: '',
      tags: '',
      readTime: 5,
      difficulty: '',
      language: 'English',
      images: [],
      metadata: {
        methodology: '',
        findings: '',
        implications: '',
        references: '',
        doi: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        publisher: ''
      }
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const newImage = {
          imageUrl: data.imageUrl,
          altText: '',
          caption: '',
          displayOrder: formData.images.length,
          isFeatured: formData.images.length === 0 // First image is featured by default
        }

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }))

        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
          type: 'success'
        })
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to upload image',
          type: 'error'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        type: 'error'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImageData = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }))
  }

  const handleSave = async () => {
    try {
      const url = editingItem 
        ? `/api/dashboard/research/${editingItem}`
        : '/api/dashboard/research'
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: editingItem ? 'Research updated successfully' : 'Research created successfully',
          type: 'success'
        })
        setEditingItem(null)
        setIsCreating(false)
        setFormData({
          title: '',
          description: '',
          content: '',
          image: '',
          published: false,
          featured: false,
          categoryId: ''
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to save research',
          type: 'error'
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save research',
        type: 'error'
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research paper?')) {
      return
    }

    try {
      const response = await fetch(`/api/dashboard/research/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Research deleted successfully',
          type: 'success'
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete research',
          type: 'error'
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete research',
        type: 'error'
      })
    }
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsCreating(false)
    setActiveTab('basic')
    setFormData({
      title: '',
      description: '',
      excerpt: '',
      content: '',
      published: false,
      featured: false,
      categoryId: '',
      tags: '',
      readTime: 5,
      difficulty: '',
      language: 'English',
      images: [],
      metadata: {
        methodology: '',
        findings: '',
        implications: '',
        references: '',
        doi: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        publisher: ''
      }
    })
  }

  const getStatusBadge = (published: boolean, featured: boolean) => {
    if (!published) {
      return <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">Draft</Badge>
    }
    if (featured) {
      return <Badge variant="default" className="bg-purple-600 text-white">Featured</Badge>
    }
    return <Badge variant="default" className="bg-green-600 text-white">Published</Badge>
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-200">Loading research management...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-200 max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Research Management
                  </h1>
                </div>
                <p className="text-xl text-blue-200/80">Manage research papers and publications</p>
              </div>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Research
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search research papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500 pl-10"
            />
          </div>
        </motion.div>

        {/* Create/Edit Form */}
        {(isCreating || editingItem) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  {isCreating ? 'Create New Research' : 'Edit Research'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tabs */}
                <div className="flex space-x-1 bg-black/40 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'basic'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-200 hover:bg-blue-500/20'
                    }`}
                  >
                    Basic Info
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'images'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-200 hover:bg-blue-500/20'
                    }`}
                  >
                    Images ({formData.images.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('metadata')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'metadata'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-200 hover:bg-blue-500/20'
                    }`}
                  >
                    Metadata
                  </button>
                </div>

                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Excerpt</label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={2}
                        placeholder="Brief summary for cards and previews"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Content</label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Tags</label>
                        <Input
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                          placeholder="comma-separated tags"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Read Time (minutes)</label>
                        <Input
                          type="number"
                          value={formData.readTime}
                          onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 0 })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Difficulty</label>
                        <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                          <SelectTrigger className="bg-black/40 border-blue-500/30 text-blue-100">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-blue-500/30">
                            <SelectItem value="">Any</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Language</label>
                        <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                          <SelectTrigger className="bg-black/40 border-blue-500/30 text-blue-100">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-blue-500/30">
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Category</label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                        <SelectTrigger className="bg-black/40 border-blue-500/30 text-blue-100">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-blue-500/30">
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Upload Images</label>
                      <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage || formData.images.length >= 4}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingImage ? 'Uploading...' : 'Choose Image'}
                        </label>
                        <p className="text-sm text-blue-200/60 mt-2">
                          Max 4 images, 5MB each. JPEG, PNG, GIF, WebP supported.
                        </p>
                      </div>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-blue-200">Uploaded Images</h3>
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-black/40 rounded-lg">
                            <div className="flex-shrink-0">
                              <img
                                src={image.imageUrl}
                                alt={image.altText || `Research image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-blue-200/60 mb-1">Alt Text</label>
                                  <Input
                                    value={image.altText}
                                    onChange={(e) => updateImageData(index, 'altText', e.target.value)}
                                    className="bg-black/60 border-blue-500/30 text-blue-100 text-sm"
                                    placeholder="Image description"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-blue-200/60 mb-1">Caption</label>
                                  <Input
                                    value={image.caption}
                                    onChange={(e) => updateImageData(index, 'caption', e.target.value)}
                                    className="bg-black/60 border-blue-500/30 text-blue-100 text-sm"
                                    placeholder="Image caption"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={image.isFeatured}
                                    onChange={(e) => updateImageData(index, 'isFeatured', e.target.checked)}
                                    className="rounded border-blue-500/30 bg-blue-500/20 text-blue-400 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-200">Featured Image</span>
                                </label>
                                <Button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Metadata Tab */}
                {activeTab === 'metadata' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Methodology</label>
                      <Textarea
                        value={formData.metadata.methodology}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, methodology: e.target.value } })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={3}
                        placeholder="Research methodology and approach"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Key Findings</label>
                      <Textarea
                        value={formData.metadata.findings}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, findings: e.target.value } })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={3}
                        placeholder="Main findings and results"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Implications</label>
                      <Textarea
                        value={formData.metadata.implications}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, implications: e.target.value } })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={3}
                        placeholder="Research implications and impact"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Journal</label>
                        <Input
                          value={formData.metadata.journal}
                          onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, journal: e.target.value } })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                          placeholder="Journal name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Publisher</label>
                        <Input
                          value={formData.metadata.publisher}
                          onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, publisher: e.target.value } })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                          placeholder="Publisher name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Volume</label>
                        <Input
                          value={formData.metadata.volume}
                          onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, volume: e.target.value } })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                          placeholder="Volume"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Issue</label>
                        <Input
                          value={formData.metadata.issue}
                          onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, issue: e.target.value } })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                          placeholder="Issue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Pages</label>
                        <Input
                          value={formData.metadata.pages}
                          onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, pages: e.target.value } })}
                          className="bg-black/40 border-blue-500/30 text-blue-100"
                          placeholder="Page numbers"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">DOI</label>
                      <Input
                        value={formData.metadata.doi}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, doi: e.target.value } })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        placeholder="Digital Object Identifier"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">References</label>
                      <Textarea
                        value={formData.metadata.references}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, references: e.target.value } })}
                        className="bg-black/40 border-blue-500/30 text-blue-100"
                        rows={4}
                        placeholder="References and citations"
                      />
                    </div>
                  </div>
                )}

                {/* Common Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="rounded border-blue-500/30 bg-blue-500/20 text-blue-400 focus:ring-blue-500"
                      />
                      <span className="text-blue-200">Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-blue-500/30 bg-blue-500/20 text-blue-400 focus:ring-blue-500"
                      />
                      <span className="text-blue-200">Featured</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Research List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredResearch.length === 0 ? (
            <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-semibold text-blue-100 mb-2">No research papers found</h3>
                <p className="text-blue-200/60">Create your first research paper to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredResearch.map((item) => (
                <Card key={item.id} className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-blue-100">{item.title}</CardTitle>
                          {getStatusBadge(item.published, item.featured)}
                        </div>
                        <CardDescription className="text-blue-200/80">
                          {item.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/research/${item.id}`)}
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-blue-200/60">
                        <User className="w-4 h-4" />
                        <span>{item.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200/60">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      {item.category && (
                        <Badge variant="secondary" className="text-xs bg-blue-600/20 text-blue-400">
                          {item.category.name}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Toast Container */}
        <ToastContainer toasts={toasts} dismiss={dismiss} />
      </div>
    </div>
  )
}