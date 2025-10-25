'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { FileText, Shield, Cookie, Save, Eye, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

interface LegalPage {
  id: string
  title: string
  slug: string
  content: string
  lastUpdated: string
  status: 'published' | 'draft'
}

export default function LegalPagesForm() {
  const [pages, setPages] = useState<LegalPage[]>([
    {
      id: 'privacy',
      title: 'Privacy Policy',
      slug: 'privacy',
      content: `# Privacy Policy

## Information We Collect
We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us. This may include your name, email address, phone number, and other personal information.

## How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about our products and services.

## Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy or as required by law.

## Data Security
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights
You have the right to access, update, and delete your personal information. You can also opt-out of receiving marketing communications from us.

## Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@arivelab.com.`,
      lastUpdated: new Date().toISOString(),
      status: 'published'
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      slug: 'terms',
      content: `# Terms of Service

## Acceptance of Terms
By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

## Use License
Permission is granted to temporarily download one copy of the materials on Arive Lab's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.

## User Accounts
You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.

## Intellectual Property
All content included on this website, such as text, graphics, logos, images, and digital downloads is the property of Arive Lab or its content suppliers and protected by international copyright laws.

## Limitation of Liability
In no event shall Arive Lab or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials.

## Termination
This agreement is effective until terminated by either party. You may terminate this agreement at any time by discontinuing your use of the website and destroying all materials obtained from this website.`,
      lastUpdated: new Date().toISOString(),
      status: 'published'
    },
    {
      id: 'cookies',
      title: 'Cookie Policy',
      slug: 'cookies',
      content: `# Cookie Policy

## What Are Cookies?
Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better browsing experience.

## How We Use Cookies
We use cookies for various purposes, including:
- To remember your preferences and settings
- To understand how you use our website
- To improve our website performance and functionality
- To provide personalized content and advertisements

## Types of Cookies We Use

### Essential Cookies
Necessary for the website to function properly and cannot be disabled.

### Analytics Cookies
Help us understand how visitors interact with our website.

### Functional Cookies
Enable enhanced functionality and personalization.

### Advertising Cookies
Used to deliver relevant advertisements and track marketing campaigns.

## Managing Cookies
You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the cookie consent banner that appears when you first visit our website.

## Third-Party Cookies
We may use third-party services that set cookies on your device. These third parties include analytics providers, advertising networks, and social media platforms.

## Contact Us
If you have any questions about this Cookie Policy, please contact us at privacy@arivelab.com.`,
      lastUpdated: new Date().toISOString(),
      status: 'published'
    }
  ])
  
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast, toasts, dismiss } = useToast()

  const handleEdit = (pageId: string, content: string) => {
    setEditingPage(pageId)
    setEditContent(content)
  }

  const handleSave = async (pageId: string) => {
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPages(prev => prev.map(page => 
        page.id === pageId 
          ? { ...page, content: editContent, lastUpdated: new Date().toISOString() }
          : page
      ))
      
      setEditingPage(null)
      setEditContent('')
      
      toast({
        title: "Success",
        description: "Legal page updated successfully",
        variant: "default"
      })
    } catch (err) {
      setError('Failed to update legal page')
      toast({
        title: "Error",
        description: "Failed to update legal page",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingPage(null)
    setEditContent('')
  }

  const handlePreview = (slug: string) => {
    window.open(`/${slug}`, '_blank')
  }

  const getPageIcon = (pageId: string) => {
    switch (pageId) {
      case 'privacy':
        return <Shield className="w-5 h-5 text-blue-500" />
      case 'terms':
        return <FileText className="w-5 h-5 text-purple-500" />
      case 'cookies':
        return <Cookie className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Legal Pages Management</h2>
          <p className="text-gray-400">Manage privacy policy, terms of service, and cookie policy content</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Legal Pages Grid */}
      <div className="grid gap-6">
        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPageIcon(page.id)}
                    <div>
                      <CardTitle className="text-white">{page.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={page.status === 'published' ? 'default' : 'secondary'}
                      className={page.status === 'published' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                      }
                    >
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(page.slug)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingPage === page.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`content-${page.id}`} className="text-white">
                        Content (Markdown supported)
                      </Label>
                      <Textarea
                        id={`content-${page.id}`}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={20}
                        className="mt-2 bg-gray-900 border-gray-700 text-white resize-none focus:border-blue-500"
                        placeholder="Enter page content..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(page.id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                        {page.content}
                      </pre>
                    </div>
                    <Button
                      onClick={() => handleEdit(page.id, page.content)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50">
        {toasts.map((toast, index) => (
          <div
            key={index}
            className={`mb-2 p-4 rounded-lg shadow-lg ${
              toast.variant === 'destructive' 
                ? 'bg-red-600 text-white' 
                : 'bg-green-600 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{toast.title}</div>
                <div className="text-sm opacity-90">{toast.description}</div>
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}