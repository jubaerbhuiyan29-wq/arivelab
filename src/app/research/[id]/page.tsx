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

interface ResearchData {
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

export default function ResearchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const researchId = params.id as string
  
  const [research, setResearch] = useState<ResearchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch(`/api/research/${researchId}`)
        if (!response.ok) {
          throw new Error('Research not found')
        }
        const data = await response.json()
        setResearch(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load research')
      } finally {
        setLoading(false)
      }
    }

    if (researchId) {
      fetchResearch()
    }
  }, [researchId])

  const getIconForCategory = (categoryName: string) => {
    const categoryLower = categoryName.toLowerCase()
    if (categoryLower.includes('electric') || categoryLower.includes('ev')) return '⚡'
    if (categoryLower.includes('autonomous') || categoryLower.includes('ai')) return '🤖'
    if (categoryLower.includes('battery')) return '🔋'
    if (categoryLower.includes('sustainable') || categoryLower.includes('mobility')) return '🌱'
    if (categoryLower.includes('smart') || categoryLower.includes('charging')) return '🔌'
    if (categoryLower.includes('vehicle')) return '🚗'
    if (categoryLower.includes('research')) return '🔬'
    if (categoryLower.includes('innovation')) return '💡'
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
          <p className="text-gray-300">Loading research details...</p>
        </div>
      </div>
    )
  }

  if (error || !research) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Research Not Found</h1>
          <p className="text-gray-400 mb-6">The research you're looking for doesn't exist or couldn't be loaded.</p>
          <Link href="/research">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research
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
            <Link href="/research" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research
            </Link>
            <div className="flex items-center space-x-4">
              {research.featured && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Research Content */}
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
                {getIconForCategory(research.category?.name || 'research')}
              </div>
              {research.category && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {research.category.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
              {research.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6 font-rajdhani leading-relaxed">
              {research.description}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published: {formatDate(research.createdAt)}</span>
              </div>
              {research.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By: {research.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Status: {research.published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
          </div>

          {/* Research Image */}
          {research.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={research.image}
                  alt={research.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Research Content */}
          {research.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron">Research Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: research.content }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Related Research */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Related Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder for related research - you can fetch these from API */}
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-blue-300 font-orbitron">Autonomous Driving AI</CardTitle>
                  <CardDescription className="text-gray-400">
                    Machine learning algorithms for safer and more reliable autonomous vehicle navigation systems.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-blue-300 font-orbitron">Sustainable Mobility Solutions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Eco-friendly transportation alternatives and their impact on urban environments.
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