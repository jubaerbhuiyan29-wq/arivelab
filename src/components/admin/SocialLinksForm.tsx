'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string | null
}

export default function SocialLinksForm() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/social')
      const data = await response.json()
      setSocialLinks(data)
    } catch (error) {
      console.error('Error fetching social links:', error)
      toast({
        title: "Error",
        description: "Failed to fetch social links",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: ''
    }
    setSocialLinks(prev => [...prev, newLink])
  }

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id))
  }

  const handleSocialLinkChange = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update existing links and add new ones
      const updatePromises = socialLinks.map(async (link) => {
        const response = await fetch('/api/social', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(link),
        })
        return response.json()
      })

      await Promise.all(updatePromises)

      toast({
        title: "Success",
        description: "Social links updated successfully",
      })
      
      // Refresh the data
      await fetchSocialLinks()
    } catch (error) {
      console.error('Error updating social links:', error)
      toast({
        title: "Error",
        description: "Failed to update social links",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getIconForPlatform = (platform: string) => {
    const iconMap: { [key: string]: string } = {
      'twitter': '🐦',
      'linkedin': '💼',
      'github': '💻',
      'facebook': '📘',
      'instagram': '📷',
      'youtube': '📺',
      'discord': '🎮',
      'telegram': '📱'
    }
    return iconMap[platform.toLowerCase()] || '🔗'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white">Loading social links...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Social Links Stats */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-400">Social Links</h3>
              <p className="text-sm text-gray-400">Social media links displayed in footer</p>
            </div>
            <Badge variant="secondary" className="bg-green-600 text-white">
              {socialLinks.length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Social Links List */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-green-400">Social Links Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={link.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Social Link #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => handleRemoveSocialLink(link.id)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`platform-${link.id}`} className="text-white">Platform</Label>
                    <Input
                      id={`platform-${link.id}`}
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(link.id, 'platform', e.target.value)}
                      className="mt-2 bg-gray-600 border-gray-500 text-white"
                      placeholder="Twitter"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`url-${link.id}`} className="text-white">URL</Label>
                    <Input
                      id={`url-${link.id}`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                      className="mt-2 bg-gray-600 border-gray-500 text-white"
                      placeholder="https://twitter.com/arivelab"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`icon-${link.id}`} className="text-white">Icon (optional)</Label>
                    <Input
                      id={`icon-${link.id}`}
                      value={link.icon || ''}
                      onChange={(e) => handleSocialLinkChange(link.id, 'icon', e.target.value)}
                      className="mt-2 bg-gray-600 border-gray-500 text-white"
                      placeholder="🐦"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-3 bg-gray-600 rounded-lg">
                  <Label className="text-white mb-2 block">Preview</Label>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-gray-400">
                      <span className="text-lg">
                        {link.icon || getIconForPlatform(link.platform)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{link.platform || 'Platform Name'}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">
                        {link.url || 'https://example.com'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Link Button */}
          <div className="mt-6">
            <Button
              type="button"
              onClick={handleAddSocialLink}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              Add Social Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}