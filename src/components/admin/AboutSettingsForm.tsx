'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface AboutData {
  title: string
  description: string
  image?: string | null
}

export default function AboutSettingsForm() {
  const [about, setAbout] = useState<AboutData>({
    title: '',
    description: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      setAbout(data)
    } catch (error) {
      console.error('Error fetching about data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch about data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(about),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "About section updated successfully",
        })
      } else {
        throw new Error('Failed to update about section')
      }
    } catch (error) {
      console.error('Error updating about section:', error)
      toast({
        title: "Error",
        description: "Failed to update about section",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof AboutData, value: string) => {
    setAbout(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading about data...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About Content */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">About Content</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={about.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={about.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  rows={8}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Image */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">About Image</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image" className="text-white">Image URL</Label>
                <Input
                  id="image"
                  value={about.image || ''}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com/about-image.jpg"
                />
              </div>
              
              {/* Image Preview */}
              {about.image && (
                <div className="mt-6">
                  <Label className="text-white mb-2 block">Image Preview</Label>
                  <div className="border border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={about.image}
                      alt="About preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Default Image Info */}
              {!about.image && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    If no image is provided, a default gradient image with animated orbs will be displayed.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Features Preview */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Key Features Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full pulse"></div>
              <span className="text-blue-300">Cutting-edge Research</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-purple-300">Innovative Technology</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-cyan-400 rounded-full pulse" style={{ animationDelay: '1s' }}></div>
              <span className="text-cyan-300">Future of Transportation</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            These key features will be displayed as animated indicators below the about description.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}