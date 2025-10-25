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
  FolderOpen, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Save,
  X,
  CheckCircle,
  Clock,
  Code
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast, ToastContainer } from '@/hooks/useToast'

interface ProjectItem {
  id: string
  title: string
  description: string
  content?: string
  image?: string
  published: boolean
  featured: boolean
  categoryId?: string
  authorId?: string
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
}

interface Category {
  id: string
  name: string
  type: string
}

interface FormData {
  title: string
  description: string
  content: string
  image: string
  published: boolean
  featured: boolean
  categoryId: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    image: '',
    published: false,
    featured: false,
    categoryId: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()
  const { toast, toasts, dismiss } = useToast()

  const filteredProjects = Array.isArray(projects) ? projects.filter(item =>
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
      // Fetch projects data
      const projectsResponse = await fetch('/api/dashboard/projects')
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      } else {
        setError('Failed to fetch projects data')
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories?type=PROJECT')
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

  const handleEdit = (item: ProjectItem) => {
    setEditingItem(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content || '',
      image: item.image || '',
      published: item.published,
      featured: item.featured,
      categoryId: item.categoryId || ''
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      title: '',
      description: '',
      content: '',
      image: '',
      published: false,
      featured: false,
      categoryId: ''
    })
  }

  const handleSave = async () => {
    try {
      const url = editingItem 
        ? `/api/dashboard/projects/${editingItem}`
        : '/api/dashboard/projects'
      
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
          description: editingItem ? 'Project updated successfully' : 'Project created successfully',
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
          description: errorData.error || 'Failed to save project',
          type: 'error'
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save project',
        type: 'error'
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/dashboard/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
          type: 'success'
        })
        fetchData()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete project',
          type: 'error'
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        type: 'error'
      })
    }
  }

  const handleCancel = () => {
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
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-200">Loading projects management...</p>
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
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
                className="border-green-500/30 text-green-300 hover:bg-green-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FolderOpen className="w-8 h-8 text-green-400" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    Projects Management
                  </h1>
                </div>
                <p className="text-xl text-green-200/80">Manage projects and implementations</p>
              </div>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border-green-500/30 text-green-100 placeholder-green-200/50 focus:border-green-500 pl-10"
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
            <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">
                  {isCreating ? 'Create New Project' : 'Edit Project'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/40 border-green-500/30 text-green-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-black/40 border-green-500/30 text-green-100"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-black/40 border-green-500/30 text-green-100"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">Image URL</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-black/40 border-green-500/30 text-green-100"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">Category</label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger className="bg-black/40 border-green-500/30 text-green-100">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-green-500/30">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-green-500/30 bg-green-500/20 text-green-400 focus:ring-green-500"
                    />
                    <span className="text-green-200">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-green-500/30 bg-green-500/20 text-green-400 focus:ring-green-500"
                    />
                    <span className="text-green-200">Featured</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredProjects.length === 0 ? (
            <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
              <CardContent className="text-center py-12">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
                <h3 className="text-xl font-semibold text-green-100 mb-2">No projects found</h3>
                <p className="text-green-200/60">Create your first project to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredProjects.map((item) => (
                <Card key={item.id} className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-green-100">{item.title}</CardTitle>
                          {getStatusBadge(item.published, item.featured)}
                        </div>
                        <CardDescription className="text-green-200/80">
                          {item.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/projects/${item.id}`)}
                          className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="bg-green-600 hover:bg-green-700"
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
                      <div className="flex items-center gap-2 text-green-200/60">
                        <User className="w-4 h-4" />
                        <span>{item.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-200/60">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      {item.category && (
                        <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400">
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