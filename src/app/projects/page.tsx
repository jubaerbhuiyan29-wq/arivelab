'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Search, Filter, FolderOpen, Calendar, User, ArrowLeft, Code } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FooterSection from '@/components/sections/FooterSection'

interface ProjectItem {
  id: string
  title: string
  description: string
  image?: string
  content?: string
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch projects data
      const projectsResponse = await fetch('/api/projects')
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

  const filteredProjects = projects.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || !selectedCategory || item.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (published: boolean, featured: boolean) => {
    if (!published) {
      return <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">Draft</Badge>
    }
    if (featured) {
      return <Badge variant="default" className="bg-purple-600 text-white">Featured</Badge>
    }
    return <Badge variant="default" className="bg-green-600 text-white">Published</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-200">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-red-200 mb-6">{error}</p>
          <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
          <p className="text-xl text-green-100">Explore our innovative projects and implementations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border-green-500/30 text-green-100 placeholder-green-200/50 focus:border-green-500 pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/40 border-green-500/30 text-green-100">
                <SelectValue placeholder="All Categories" />
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
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
            <h3 className="text-xl font-semibold text-green-100 mb-2">No projects found</h3>
            <p className="text-green-200/60">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 border border-green-500/20 rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300"
              >
                <Card className="bg-transparent border-0 h-full">
                  {item.image && (
                    <div className="aspect-video bg-gradient-to-br from-green-600 to-teal-600">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg font-semibold text-green-100 line-clamp-2">
                        {item.title}
                      </CardTitle>
                      {getStatusBadge(item.published, item.featured)}
                    </div>
                    <CardDescription className="text-green-200/80 line-clamp-3">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-green-200/60">
                        <User className="w-4 h-4" />
                        <span>{item.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-200/60">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      {item.category && (
                        <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-400">
                          {item.category.name}
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full border-green-500/30 text-green-300 hover:bg-green-600/20"
                        onClick={() => router.push(`/projects/${item.id}`)}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}