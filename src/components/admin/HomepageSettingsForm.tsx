'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface HomepageSettings {
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  heroCtaLink: string
  bannerImage?: string | null
  bannerVideo?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export default function HomepageSettingsForm() {
  const [settings, setSettings] = useState<HomepageSettings>({
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: '',
    heroCtaLink: '',
    bannerImage: '',
    bannerVideo: '',
    seoTitle: '',
    seoDescription: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/homepage')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching homepage settings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch homepage settings",
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
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Homepage settings updated successfully",
        })
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating homepage settings:', error)
      toast({
        title: "Error",
        description: "Failed to update homepage settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof HomepageSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading settings...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroTitle" className="text-white">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle" className="text-white">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  rows={3}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Call-to-Action</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroCtaText" className="text-white">CTA Button Text</Label>
                <Input
                  id="heroCtaText"
                  value={settings.heroCtaText}
                  onChange={(e) => handleInputChange('heroCtaText', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="heroCtaLink" className="text-white">CTA Button Link</Label>
                <Input
                  id="heroCtaLink"
                  value={settings.heroCtaLink}
                  onChange={(e) => handleInputChange('heroCtaLink', e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Section */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Banner Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bannerImage" className="text-white">Banner Image URL</Label>
              <Input
                id="bannerImage"
                value={settings.bannerImage || ''}
                onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="bannerVideo" className="text-white">Banner Video URL</Label>
              <Input
                id="bannerVideo"
                value={settings.bannerVideo || ''}
                onChange={(e) => handleInputChange('bannerVideo', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-400">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="seoTitle" className="text-white">SEO Title</Label>
              <Input
                id="seoTitle"
                value={settings.seoTitle || ''}
                onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="Arive Lab - Automotive Research Innovation"
              />
            </div>
            <div>
              <Label htmlFor="seoDescription" className="text-white">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={settings.seoDescription || ''}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="Leading the future of automotive research and innovation"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}