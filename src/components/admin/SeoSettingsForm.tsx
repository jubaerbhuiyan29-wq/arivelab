'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface SeoSettings {
  title: string
  description: string
  keywords: string
  author: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  robots: string
  canonical: string
}

export default function SeoSettingsForm() {
  const [settings, setSettings] = useState<SeoSettings>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    robots: 'index, follow',
    canonical: ''
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
      
      // Transform homepage settings to SEO settings
      setSettings({
        title: data.seoTitle || '',
        description: data.seoDescription || '',
        keywords: '',
        author: '',
        ogTitle: data.seoTitle || '',
        ogDescription: data.seoDescription || '',
        ogImage: '',
        twitterCard: 'summary_large_image',
        twitterTitle: data.seoTitle || '',
        twitterDescription: data.seoDescription || '',
        twitterImage: '',
        robots: 'index, follow',
        canonical: ''
      })
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch SEO settings",
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
      // Update homepage settings with SEO data
      const homepageData = {
        heroTitle: 'Welcome to Arive Lab', // This would be fetched from current settings
        heroSubtitle: 'Innovating the Future of Automotive Research',
        heroCtaText: 'Join Now',
        heroCtaLink: '/register',
        bannerImage: '',
        bannerVideo: '',
        seoTitle: settings.title,
        seoDescription: settings.description
      }

      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "SEO settings updated successfully",
        })
      } else {
        throw new Error('Failed to update SEO settings')
      }
    } catch (error) {
      console.error('Error updating SEO settings:', error)
      toast({
        title: "Error",
        description: "Failed to update SEO settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof SeoSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading SEO settings...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic SEO Settings */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-400">Basic SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-white">Meta Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="Arive Lab - Automotive Research Innovation"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Recommended: 50-60 characters</p>
            </div>
            <div>
              <Label htmlFor="description" className="text-white">Meta Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="Leading the future of automotive research and innovation"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Recommended: 150-160 characters</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced SEO Settings */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Advanced SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="keywords" className="text-white">Meta Keywords</Label>
              <Input
                id="keywords"
                value={settings.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="automotive research, innovation, technology"
              />
              <p className="text-xs text-gray-400 mt-1">Comma-separated keywords</p>
            </div>
            <div>
              <Label htmlFor="author" className="text-white">Meta Author</Label>
              <Input
                id="author"
                value={settings.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="Arive Lab Team"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph Settings */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Open Graph Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ogTitle" className="text-white">OG Title</Label>
              <Input
                id="ogTitle"
                value={settings.ogTitle}
                onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="Arive Lab - Automotive Research Innovation"
              />
            </div>
            <div>
              <Label htmlFor="ogDescription" className="text-white">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={settings.ogDescription}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="Leading the future of automotive research and innovation"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="ogImage" className="text-white">OG Image URL</Label>
            <Input
              id="ogImage"
              value={settings.ogImage}
              onChange={(e) => handleInputChange('ogImage', e.target.value)}
              className="mt-2 bg-gray-700 border-gray-600 text-white"
              placeholder="https://example.com/og-image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Twitter Card Settings */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Twitter Card Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="twitterCard" className="text-white">Twitter Card Type</Label>
              <select
                id="twitterCard"
                value={settings.twitterCard}
                onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white p-2 rounded"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </select>
            </div>
            <div>
              <Label htmlFor="twitterTitle" className="text-white">Twitter Title</Label>
              <Input
                id="twitterTitle"
                value={settings.twitterTitle}
                onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="Arive Lab - Automotive Research Innovation"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label htmlFor="twitterDescription" className="text-white">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                value={settings.twitterDescription}
                onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                rows={3}
                placeholder="Leading the future of automotive research and innovation"
              />
            </div>
            <div>
              <Label htmlFor="twitterImage" className="text-white">Twitter Image URL</Label>
              <Input
                id="twitterImage"
                value={settings.twitterImage}
                onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://example.com/twitter-image.jpg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical SEO Settings */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Technical SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="robots" className="text-white">Meta Robots</Label>
              <select
                id="robots"
                value={settings.robots}
                onChange={(e) => handleInputChange('robots', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white p-2 rounded"
              >
                <option value="index, follow">Index, Follow</option>
                <option value="index, nofollow">Index, Nofollow</option>
                <option value="noindex, follow">Noindex, Follow</option>
                <option value="noindex, nofollow">Noindex, Nofollow</option>
              </select>
            </div>
            <div>
              <Label htmlFor="canonical" className="text-white">Canonical URL</Label>
              <Input
                id="canonical"
                value={settings.canonical}
                onChange={(e) => handleInputChange('canonical', e.target.value)}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                placeholder="https://arivelab.com/"
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
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}