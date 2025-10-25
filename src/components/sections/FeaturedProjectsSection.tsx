'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProjectItem {
  id: string
  title: string
  description: string
  image?: string | null
  category?: {
    id: string
    name: string
  }
}

export default function FeaturedProjectsSection() {
  // Static fallback data for instant loading
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: '1',
      title: 'Autonomous Fleet Management',
      description: 'AI-powered system for managing and coordinating autonomous vehicle fleets in urban environments.',
      category: { id: '1', name: 'Autonomous Systems' }
    },
    {
      id: '2',
      title: 'Electric Vehicle Charging Network',
      description: 'Smart charging infrastructure with real-time monitoring and load balancing capabilities.',
      category: { id: '2', name: 'Infrastructure' }
    },
    {
      id: '3',
      title: 'Vehicle Health Monitoring',
      description: 'IoT-based predictive maintenance system for continuous vehicle health assessment.',
      category: { id: '3', name: 'IoT & Sensors' }
    },
    {
      id: '4',
      title: 'Sustainable Mobility Platform',
      description: 'Integrated platform connecting various sustainable transportation options and services.',
      category: { id: '4', name: 'Sustainability' }
    },
    {
      id: '5',
      title: 'Advanced Driver Assistance',
      description: 'Next-generation ADAS with computer vision and machine learning capabilities.',
      category: { id: '5', name: 'Safety Systems' }
    },
    {
      id: '6',
      title: 'Connected Vehicle Ecosystem',
      description: 'V2X communication system for enhanced vehicle-to-vehicle and vehicle-to-infrastructure interaction.',
      category: { id: '6', name: 'Connectivity' }
    }
  ])
  
  const [loading, setLoading] = useState(false) // Start with false for instant render
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    // Load data in background after initial render
    const fetchData = async () => {
      try {
        console.log('FeaturedProjectsSection: Fetching data from API...')
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 3000)
        )
        
        const response = await Promise.race([
          fetch('/api/projects?featured=true&limit=6'),
          timeoutPromise
        ])

        if (response.ok) {
          const projectsData = await response.json()
          console.log('FeaturedProjectsSection: Projects data:', projectsData)
          setProjects(projectsData.slice(0, 6))
        }
      } catch (error) {
        console.error('FeaturedProjectsSection: Error fetching featured projects:', error)
        // Keep using static fallback data
      }
    }
    
    // Load data after a short delay
    const timer = setTimeout(fetchData, 2000)
    return () => clearTimeout(timer)
  }, [])

  const getIconForCategory = (categoryName: string) => {
    const categoryLower = categoryName.toLowerCase()
    if (categoryLower.includes('autonomous') || categoryLower.includes('ai')) return '🤖'
    if (categoryLower.includes('electric') || categoryLower.includes('charging')) return '⚡'
    if (categoryLower.includes('infrastructure')) return '🏗️'
    if (categoryLower.includes('iot') || categoryLower.includes('sensor')) return '📡'
    if (categoryLower.includes('sustainable') || categoryLower.includes('mobility')) return '🌱'
    if (categoryLower.includes('safety') || categoryLower.includes('adas')) return '🛡️'
    if (categoryLower.includes('connected') || categoryLower.includes('v2x')) return '🔗'
    if (categoryLower.includes('vehicle')) return '🚗'
    if (categoryLower.includes('project')) return '💼'
    return '📋' // Default icon
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Simplified background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/2 via-pink-500/2 to-blue-500/2" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-56 h-56 bg-purple-500 rounded-full filter blur-[60px] opacity-5" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full filter blur-[80px] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-orbitron tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-rajdhani font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore our cutting-edge automotive projects that are shaping the future of transportation
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(`project-${project.id}`)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className={`group relative bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white overflow-hidden transition-all duration-300 hover:border-purple-500/50 h-full ${hoveredCard === `project-${project.id}` ? 'transform scale-102' : ''}`}>
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative z-10 pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">
                      {getIconForCategory(project.category?.name || 'project')}
                    </div>
                    {project.category && (
                      <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                        {project.category.name}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-300 font-orbitron leading-tight">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <CardDescription className="text-gray-300 leading-relaxed font-rajdhani text-sm">
                    {project.description}
                  </CardDescription>
                  
                  {/* Accent line */}
                  <div className="mt-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <Button 
              variant="outline" 
              className="group relative border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 font-orbitron tracking-wide"
            >
              <span className="flex items-center gap-3">
                View All Projects
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}