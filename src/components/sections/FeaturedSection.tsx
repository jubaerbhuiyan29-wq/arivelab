'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ResearchItem {
  id: string
  title: string
  description: string
  image?: string | null
  category?: {
    id: string
    name: string
  }
}

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

export default function FeaturedSection() {
  // Static fallback data for instant loading
  const [research, setResearch] = useState<ResearchItem[]>([
    {
      id: '1',
      title: 'Electric Vehicle Battery Optimization',
      description: 'Advanced research on extending battery life and improving charging efficiency for next-generation electric vehicles.',
      category: { id: '1', name: 'Electric Vehicles' }
    },
    {
      id: '2',
      title: 'Autonomous Driving AI',
      description: 'Machine learning algorithms for safer and more reliable autonomous vehicle navigation systems.',
      category: { id: '2', name: 'Artificial Intelligence' }
    },
    {
      id: '3',
      title: 'Sustainable Mobility Solutions',
      description: 'Eco-friendly transportation alternatives and their impact on urban environments.',
      category: { id: '3', name: 'Sustainability' }
    }
  ])
  
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: '1',
      title: 'Smart Charging Infrastructure',
      description: 'Development of intelligent charging stations for electric vehicles with grid integration.',
      category: { id: '4', name: 'Infrastructure' }
    },
    {
      id: '2',
      title: 'Vehicle-to-Grid Communication',
      description: 'Implementing V2G technology for better energy management and grid stability.',
      category: { id: '5', name: 'Connectivity' }
    },
    {
      id: '3',
      title: 'Predictive Maintenance System',
      description: 'AI-powered system for predicting vehicle maintenance needs before failures occur.',
      category: { id: '6', name: 'Maintenance' }
    }
  ])
  
  const [loading, setLoading] = useState(false) // Start with false
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    // Load data in background after initial render
    const fetchData = async () => {
      try {
        console.log('FeaturedSection: Fetching data from APIs...')
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 3000)
        )
        
        const [researchRes, projectsRes] = await Promise.all([
          Promise.race([
            fetch('/api/research?featured=true&limit=6'),
            timeoutPromise
          ]),
          Promise.race([
            fetch('/api/projects?featured=true&limit=6'),
            timeoutPromise
          ])
        ])

        if (researchRes.ok && projectsRes.ok) {
          const researchData = await researchRes.json()
          const projectsData = await projectsRes.json()
          console.log('FeaturedSection: Research data:', researchData)
          console.log('FeaturedSection: Projects data:', projectsData)

          setResearch(researchData.slice(0, 6))
          setProjects(projectsData.slice(0, 6))
        }
      } catch (error) {
        console.error('FeaturedSection: Error fetching featured content:', error)
        // Keep using static fallback data
      }
    }
    
    // Load data after a short delay
    const timer = setTimeout(fetchData, 1500)
    return () => clearTimeout(timer)
  }, [])

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

  // No loading check - render immediately with static data

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Simplified background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 via-purple-500/2 to-pink-500/2" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 bg-blue-500 rounded-full filter blur-[60px] opacity-5" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Simplified section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-orbitron tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Featured Research & Projects
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-rajdhani font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our latest breakthroughs in automotive innovation and research
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Research Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center glow-border">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-orbitron">
                Research
              </h3>
            </div>
            
            <div className="space-y-6">
              {research.length > 0 ? research.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredCard(`research-${item.id}`)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className={`group relative bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white overflow-hidden transition-all duration-300 hover:border-blue-500/50 ${hoveredCard === `research-${item.id}` ? 'transform scale-102' : ''}`}>
                    {/* Simplified card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative z-10 pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">
                          {getIconForCategory(item.category?.name || 'research')}
                        </div>
                        {item.category && (
                          <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
                            {item.category.name}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-semibold text-blue-300 group-hover:text-blue-200 transition-colors duration-300 font-orbitron">
                        {item.title || "Research Title"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-0">
                      <CardDescription className="text-gray-300 leading-relaxed font-rajdhani">
                        {item.description || "Research description will appear here."}
                      </CardDescription>
                      
                      {/* See Details Button */}
                      <div className="mt-4">
                        <Link href={`/research/${item.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="group relative border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              See Details
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Simplified accent line */}
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                    </CardContent>
                  </Card>
                </motion.div>
              )) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white">
                    <CardContent className="pt-8 text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-gray-400 font-rajdhani">Loading featured research...</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
            
            {/* See More Button */}
            {research.length >= 3 && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                viewport={{ once: true }}
              >
                <Link href="/research">
                  <Button 
                    variant="outline" 
                    className="group relative border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 electric-button-outline font-orbitron tracking-wide"
                  >
                    <span className="flex items-center gap-3">
                      View All Research
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center glow-border">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-orbitron">
                Projects
              </h3>
            </div>
            
            <div className="space-y-6">
              {projects.length > 0 ? projects.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredCard(`project-${item.id}`)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className={`group relative bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white overflow-hidden transition-all duration-300 hover:border-purple-500/50 ${hoveredCard === `project-${item.id}` ? 'transform scale-102' : ''}`}>
                    {/* Simplified card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative z-10 pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">
                          {getIconForCategory(item.category?.name || 'project')}
                        </div>
                        {item.category && (
                          <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                            {item.category.name}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-300 font-orbitron">
                        {item.title || "Project Title"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-0">
                      <CardDescription className="text-gray-300 leading-relaxed font-rajdhani">
                        {item.description || "Project description will appear here."}
                      </CardDescription>
                      
                      {/* See Details Button */}
                      <div className="mt-4">
                        <Link href={`/projects/${item.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="group relative border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              See Details
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Simplified accent line */}
                      <div className="mt-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                    </CardContent>
                  </Card>
                </motion.div>
              )) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white">
                    <CardContent className="pt-8 text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 font-rajdhani">Loading featured projects...</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
            
            {/* See More Button */}
            {projects.length >= 3 && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                viewport={{ once: true }}
              >
                <Link href="/projects">
                  <Button 
                    variant="outline" 
                    className="group relative border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 electric-button-outline font-orbitron tracking-wide"
                  >
                    <span className="flex items-center gap-3">
                      View All Projects
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}