'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import FooterSection from '@/components/sections/FooterSection'

interface ProjectData {
  id: string
  title: string
  description: string
  content?: string
  image?: string | null
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
  }
  author?: {
    id: string
    name: string
    email: string
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          throw new Error('Project not found')
        }
        const data = await response.json()
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const getIconForCategory = (categoryName: string) => {
    const categoryLower = categoryName.toLowerCase()
    if (categoryLower.includes('electric') || categoryLower.includes('ev')) return '⚡'
    if (categoryLower.includes('autonomous') || categoryLower.includes('ai')) return '🤖'
    if (categoryLower.includes('battery')) return '🔋'
    if (categoryLower.includes('sustainable') || categoryLower.includes('mobility')) return '🌱'
    if (categoryLower.includes('smart') || categoryLower.includes('charging')) return '🔌'
    if (categoryLower.includes('vehicle')) return '🚗'
    if (categoryLower.includes('infrastructure')) return '🏗️'
    if (categoryLower.includes('connectivity')) return '📡'
    if (categoryLower.includes('maintenance')) return '🛠️'
    return '📋' // Default icon
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or couldn't be loaded.</p>
          <Link href="/projects">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/projects" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
            <div className="flex items-center space-x-4">
              {project.featured && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Project Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                {getIconForCategory(project.category?.name || 'project')}
              </div>
              {project.category && (
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  {project.category.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6 font-rajdhani leading-relaxed">
              {project.description}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(project.createdAt)}</span>
              </div>
              {project.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By: {project.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Status: {project.published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
          </div>

          {/* Project Image */}
          {project.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Project Content */}
          {project.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: project.content }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Related Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder for related projects - you can fetch these from API */}
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-purple-300 font-orbitron">Smart Charging Infrastructure</CardTitle>
                  <CardDescription className="text-gray-400">
                    Development of intelligent charging stations for electric vehicles with grid integration.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-purple-300 font-orbitron">Vehicle-to-Grid Communication</CardTitle>
                  <CardDescription className="text-gray-400">
                    Implementing V2G technology for better energy management and grid stability.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}