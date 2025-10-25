'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface ResearchItem {
  id: string
  title: string
  description: string
  image?: string | null
  featured: boolean
  published: boolean
}

interface ProjectItem {
  id: string
  title: string
  description: string
  image?: string | null
  featured: boolean
  published: boolean
}

export default function FeaturedContentForm() {
  const [research, setResearch] = useState<ResearchItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [researchRes, projectsRes] = await Promise.all([
        fetch('/api/dashboard/research'),
        fetch('/api/dashboard/projects')
      ])

      if (!researchRes.ok || !projectsRes.ok) {
        throw new Error('Failed to fetch data from dashboard APIs')
      }

      const researchData = await researchRes.json()
      const projectsData = await projectsRes.json()

      setResearch(researchData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching featured content:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch research and projects data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFeatured = async (type: 'research' | 'project', id: string, featured: boolean) => {
    setIsUpdating(true)
    try {
      const endpoint = type === 'research' ? `/api/dashboard/research/${id}` : `/api/dashboard/projects/${id}`
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured }),
      })

      if (response.ok) {
        // Update local state
        if (type === 'research') {
          setResearch(prev => prev.map(item => 
            item.id === id ? { ...item, featured } : item
          ))
        } else {
          setProjects(prev => prev.map(item => 
            item.id === id ? { ...item, featured } : item
          ))
        }

        toast({
          title: "Success",
          description: `${type === 'research' ? 'Research' : 'Project'} ${featured ? 'featured' : 'unfeatured'} successfully`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update featured status')
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update featured status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getFeaturedCount = (items: ResearchItem[] | ProjectItem[]) => {
    return Array.isArray(items) ? items.filter(item => item.featured).length : 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading featured content...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Featured Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-400">Featured Research</h3>
                <p className="text-sm text-gray-400">Research items featured on homepage</p>
              </div>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {getFeaturedCount(research)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Featured Projects</h3>
                <p className="text-sm text-gray-400">Projects featured on homepage</p>
              </div>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {getFeaturedCount(projects)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Items */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-blue-400">Research Items</CardTitle>
          <CardDescription className="text-gray-400">
            Toggle research items to be featured on the homepage. Maximum of 3 recommended.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {research.length > 0 ? research.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={item.published ? "default" : "secondary"} className={item.published ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                      {item.published ? "Published" : "Draft"}
                    </Badge>
                    {item.featured && (
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <Button
                    onClick={() => toggleFeatured('research', item.id, !item.featured)}
                    disabled={isUpdating}
                    variant={item.featured ? "default" : "outline"}
                    className={item.featured ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"}
                  >
                    {item.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No research items available.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Items */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-purple-400">Project Items</CardTitle>
          <CardDescription className="text-gray-400">
            Toggle project items to be featured on the homepage. Maximum of 3 recommended.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length > 0 ? projects.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={item.published ? "default" : "secondary"} className={item.published ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                      {item.published ? "Published" : "Draft"}
                    </Badge>
                    {item.featured && (
                      <Badge variant="secondary" className="bg-purple-600 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <Button
                    onClick={() => toggleFeatured('project', item.id, !item.featured)}
                    disabled={isUpdating}
                    variant={item.featured ? "default" : "outline"}
                    className={item.featured ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"}
                  >
                    {item.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No project items available.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          onClick={fetchData}
          disabled={isUpdating}
          variant="outline"
          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
        >
          Refresh Data
        </Button>
      </div>
    </div>
  )
}