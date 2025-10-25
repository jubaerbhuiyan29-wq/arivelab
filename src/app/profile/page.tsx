'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  LogOut, 
  Upload, 
  X, 
  Plus, 
  FileText, 
  FolderOpen, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
  Image as ImageIcon,
  Video,
  Tag,
  Users,
  Wrench,
  Target
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast, ToastContainer } from '@/hooks/useToast'
import FooterSection from '@/components/sections/FooterSection'

interface UserData {
  id: string
  email: string
  name?: string
  role: 'MEMBER' | 'ADMIN'
  status: string
  profilePhoto?: string
  bio?: string
  phone?: string
  gender?: string
  dateOfBirth?: string
  country?: string
  city?: string
  createdAt: string
  updatedAt: string
  registration?: {
    motivation: string
    fieldCategory: string
    hasExperience: boolean
    experienceDescription?: string
    teamworkFeelings: string
    futureGoals: string
    skills: string[]
    otherSkills?: string
    hobbies: string
    availabilityDays: number
    availabilityHours: number
    linkedin?: string
    github?: string
  }
}

interface ResearchItem {
  id: string
  title: string
  description: string
  image?: string
  video?: string
  tags: string[]
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectItem {
  id: string
  title: string
  description: string
  image?: string
  toolsUsed?: string
  developmentStage?: string
  teamMembers?: string
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [research, setResearch] = useState<ResearchItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    bio: ''
  })
  const router = useRouter()
  const { user: authUser, loading: authLoading, isAuthenticated, logout } = useAuth()
  const { toast, toasts, dismiss } = useToast()
  
  // Upload states
  const [researchForm, setResearchForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    video: '',
    tags: '',
    images: [] as File[]
  })
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    toolsUsed: '',
    developmentStage: '',
    teamMembers: '',
    video: '',
    tags: '',
    images: [] as File[]
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // Check if user is approved
      if (authUser?.status !== 'APPROVED') {
        router.push('/login?message=Your account is pending approval')
        return
      }

      const fetchData = async () => {
        try {
          // Fetch user data
          const userResponse = await fetch(`/api/user/${authUser?.userId}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUser(userData)
            setEditForm(userData)
          }

          // Fetch research
          const researchResponse = await fetch(`/api/research?authorId=${authUser?.userId}`)
          if (researchResponse.ok) {
            const researchData = await researchResponse.json()
            setResearch(researchData)
          }

          // Fetch projects
          const projectsResponse = await fetch(`/api/projects?authorId=${authUser?.userId}`)
          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json()
            setProjects(projectsData)
          }

          // Mock activity data
          setActivity([
            {
              id: '1',
              type: 'login',
              title: 'Welcome Back!',
              description: 'You have successfully logged into your Arive Lab profile.',
              timestamp: new Date().toISOString()
            }
          ])

        } catch (err: any) {
          setError(err.message || 'Failed to load profile')
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [authUser, authLoading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
  }

  const handleEditProfile = async () => {
    try {
      const response = await fetch(`/api/user/${authUser?.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setUser(editForm as UserData)
        setIsEditing(false)
        toast({ title: 'Profile updated successfully!' })
      } else {
        toast({ title: 'Failed to update profile' })
      }
    } catch (error) {
      toast({ title: 'Error updating profile' })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'research' | 'project') => {
    const files = Array.from(e.target.files || [])
    if (type === 'research') {
      setResearchForm(prev => ({ ...prev, images: [...prev.images, ...files] }))
    } else {
      setProjectForm(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  const removeImage = (index: number, type: 'research' | 'project') => {
    if (type === 'research') {
      setResearchForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    } else {
      setProjectForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    }
  }

  const handleSubmitResearch = async (isDraft = false) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', researchForm.title)
      formData.append('description', researchForm.description)
      formData.append('categoryId', researchForm.categoryId)
      formData.append('video', researchForm.video)
      formData.append('tags', researchForm.tags)
      formData.append('published', (!isDraft).toString())
      formData.append('authorId', authUser?.userId || '')
      
      researchForm.images.forEach((image, index) => {
        formData.append(`images`, image)
      })

      const response = await fetch('/api/research', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({ title: isDraft ? 'Research saved as draft!' : 'Research submitted for approval!' })
        setResearchForm({
          title: '',
          description: '',
          categoryId: '',
          video: '',
          tags: '',
          images: []
        })
        // Refresh research list
        const researchResponse = await fetch(`/api/research?authorId=${authUser?.userId}`)
        if (researchResponse.ok) {
          const researchData = await researchResponse.json()
          setResearch(researchData)
        }
      } else {
        toast({ title: 'Failed to submit research' })
      }
    } catch (error) {
      toast({ title: 'Error submitting research' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitProject = async (isDraft = false) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('title', projectForm.title)
      formData.append('description', projectForm.description)
      formData.append('categoryId', projectForm.categoryId)
      formData.append('toolsUsed', projectForm.toolsUsed)
      formData.append('developmentStage', projectForm.developmentStage)
      formData.append('teamMembers', projectForm.teamMembers)
      formData.append('video', projectForm.video)
      formData.append('tags', projectForm.tags)
      formData.append('published', (!isDraft).toString())
      formData.append('authorId', authUser?.userId || '')
      
      projectForm.images.forEach((image, index) => {
        formData.append(`images`, image)
      })

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({ title: isDraft ? 'Project saved as draft!' : 'Project submitted for approval!' })
        setProjectForm({
          title: '',
          description: '',
          categoryId: '',
          toolsUsed: '',
          developmentStage: '',
          teamMembers: '',
          video: '',
          tags: '',
          images: []
        })
        // Refresh projects list
        const projectsResponse = await fetch(`/api/projects?authorId=${authUser?.userId}`)
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }
      } else {
        toast({ title: 'Failed to submit project' })
      }
    } catch (error) {
      toast({ title: 'Error submitting project' })
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (published: boolean, featured: boolean) => {
    if (!published) {
      return <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600">
        <Clock className="w-3 h-3 mr-1" />
        Pending Approval
      </Badge>
    }
    if (featured) {
      return <Badge variant="default" className="bg-purple-600 text-white">
        <Star className="w-3 h-3 mr-1" />
        Featured
      </Badge>
    }
    return <Badge variant="default" className="bg-green-600 text-white">
      <CheckCircle className="w-3 h-3 mr-1" />
      Published
    </Badge>
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-200">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-200 max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-200 max-w-md">
          <AlertDescription>User not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-900/50 to-purple-900/50 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-blue-500/[0.05] bg-[length:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Profile Header Content */}
        <div className="relative z-10 h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-black overflow-hidden">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt={user.name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-white mb-1">
                {user?.name || 'User'}
              </h1>
              <p className="text-blue-300 mb-2">
                {user?.registration?.fieldCategory || 'Researcher'} • {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
              </p>
              <p className="text-blue-200/80 text-sm">
                Pushing Boundaries in Research & Projects
              </p>
            </motion.div>
          </div>

          {/* Edit Profile Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black/80 border border-blue-500/30">
            <TabsTrigger value="overview" className="text-blue-200 data-[state=active]:bg-blue-600">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="research" className="text-blue-200 data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-blue-200 data-[state=active]:bg-blue-600">
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="upload-research" className="text-blue-200 data-[state=active]:bg-blue-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Research
            </TabsTrigger>
            <TabsTrigger value="upload-project" className="text-blue-200 data-[state=active]:bg-blue-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Project
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-blue-200 data-[state=active]:bg-blue-600">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-200/80">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-3 text-blue-200/80">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    {user?.country && user?.city && (
                      <div className="flex items-center gap-3 text-blue-200/80">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{user.city}, {user.country}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-blue-200/80">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">
                        Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        user?.status === 'APPROVED' ? 'bg-green-500' : 
                        user?.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-blue-200/80 capitalize">
                        {user?.status?.toLowerCase()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills & Hobbies Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-400" />
                      Skills & Hobbies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-blue-200/80 mb-2">Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {user?.registration?.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {user?.registration?.otherSkills && (
                      <div>
                        <Label className="text-sm font-medium text-blue-200/80 mb-2">Other Skills</Label>
                        <p className="text-sm text-blue-100">{user.registration.otherSkills}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-blue-200/80 mb-2">Hobbies</Label>
                      <p className="text-sm text-blue-100">{user?.registration?.hobbies}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-blue-200/80 mb-1">Availability</Label>
                        <p className="text-sm text-blue-100">
                          {user?.registration?.availabilityDays} days/week
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-blue-200/80 mb-1">Hours</Label>
                        <p className="text-sm text-blue-100">
                          {user?.registration?.availabilityHours} hours/week
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Professional Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-blue-200/80 mb-2">Field Category</Label>
                      <p className="text-sm text-blue-100">{user?.registration?.fieldCategory}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-200/80 mb-2">Experience</Label>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user?.registration?.hasExperience ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm text-blue-100">
                          {user?.registration?.hasExperience ? 'Has experience' : 'No experience'}
                        </span>
                      </div>
                      {user?.registration?.experienceDescription && (
                        <p className="text-sm text-blue-200/80 mt-1">
                          {user.registration.experienceDescription}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-200/80 mb-2">Teamwork Philosophy</Label>
                      <p className="text-sm text-blue-100">{user?.registration?.teamworkFeelings}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-200/80 mb-2">Future Goals</Label>
                      <p className="text-sm text-blue-100">{user?.registration?.futureGoals}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Research Library Tab */}
          <TabsContent value="research" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        My Research Library
                      </CardTitle>
                      <CardDescription className="text-blue-200/80">
                        View and manage your research submissions
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/research')}
                      className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Public Research
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {research.length === 0 ? (
                    <div className="text-center py-12 text-blue-200/60">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No research submissions yet</p>
                      <p className="text-sm">Upload your first research paper to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {research.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-black/40 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-blue-100 text-sm">{item.title}</h3>
                            {getStatusBadge(item.published, item.featured)}
                          </div>
                          <p className="text-blue-200/80 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          {item.image && (
                            <div className="w-full h-32 bg-gray-800 rounded-lg mb-3 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags?.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-blue-600/20 text-blue-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-blue-200/60">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Projects Portfolio Tab */}
          <TabsContent value="projects" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-blue-400" />
                        My Projects Portfolio
                      </CardTitle>
                      <CardDescription className="text-blue-200/80">
                        View and manage your project submissions
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/projects')}
                      className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      View Public Projects
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-blue-200/60">
                      <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No projects submitted yet</p>
                      <p className="text-sm">Upload your first project to showcase your work</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-black/40 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-blue-100 text-sm">{item.title}</h3>
                            {getStatusBadge(item.published, item.featured)}
                          </div>
                          <p className="text-blue-200/80 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          {item.image && (
                            <div className="w-full h-32 bg-gray-800 rounded-lg mb-3 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <p className="text-xs text-blue-200/60">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Upload Research Tab */}
          <TabsContent value="upload-research" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                        Upload New Research
                      </CardTitle>
                      <CardDescription className="text-blue-200/80">
                        Submit your research paper for review and publication
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/research')}
                      className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Public Research
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="research-title" className="text-blue-200/80">Research Title *</Label>
                        <Input
                          id="research-title"
                          value={researchForm.title}
                          onChange={(e) => setResearchForm(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="Enter research title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="research-category" className="text-blue-200/80">Category *</Label>
                        <Select value={researchForm.categoryId} onValueChange={(value) => setResearchForm(prev => ({ ...prev, categoryId: value }))}>
                          <SelectTrigger className="bg-black/40 border-blue-500/30 text-blue-100">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-blue-500/30">
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
                            <SelectItem value="data-science">Data Science</SelectItem>
                            <SelectItem value="machine-learning">Machine Learning</SelectItem>
                            <SelectItem value="robotics">Robotics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="research-video" className="text-blue-200/80">Video Link (Optional)</Label>
                        <Input
                          id="research-video"
                          value={researchForm.video}
                          onChange={(e) => setResearchForm(prev => ({ ...prev, video: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="research-tags" className="text-blue-200/80">Tags</Label>
                        <Input
                          id="research-tags"
                          value={researchForm.tags}
                          onChange={(e) => setResearchForm(prev => ({ ...prev, tags: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="AI, ML, Research (comma separated)"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="research-description" className="text-blue-200/80">Detailed Description *</Label>
                        <Textarea
                          id="research-description"
                          value={researchForm.description}
                          onChange={(e) => setResearchForm(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500 min-h-[120px]"
                          placeholder="Describe your research in detail..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-200/80">Images</Label>
                        <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'research')}
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                          <p className="text-blue-200/80 mb-2">Drag and drop images here</p>
                          <p className="text-blue-200/60 text-sm mb-4">or click to browse files</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Select Images
                          </Button>
                        </div>
                        {researchForm.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {researchForm.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeImage(index, 'research')}
                                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-blue-500/30">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSubmitResearch(true)}
                      disabled={uploading}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      {uploading ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmitResearch(false)}
                      disabled={uploading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    >
                      {uploading ? 'Submitting...' : 'Submit for Approval'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Upload Project Tab */}
          <TabsContent value="upload-project" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                        Upload New Project
                      </CardTitle>
                      <CardDescription className="text-blue-200/80">
                        Submit your project for review and publication
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/projects')}
                      className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      View Public Projects
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-title" className="text-blue-200/80">Project Title *</Label>
                        <Input
                          id="project-title"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="Enter project title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-category" className="text-blue-200/80">Category *</Label>
                        <Select value={projectForm.categoryId} onValueChange={(value) => setProjectForm(prev => ({ ...prev, categoryId: value }))}>
                          <SelectTrigger className="bg-black/40 border-blue-500/30 text-blue-100">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-blue-500/30">
                            <SelectItem value="web-development">Web Development</SelectItem>
                            <SelectItem value="mobile-development">Mobile Development</SelectItem>
                            <SelectItem value="desktop-application">Desktop Application</SelectItem>
                            <SelectItem value="game-development">Game Development</SelectItem>
                            <SelectItem value="iot-project">IoT Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-tools" className="text-blue-200/80">Tools Used</Label>
                        <Input
                          id="project-tools"
                          value={projectForm.toolsUsed}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, toolsUsed: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="React, Node.js, MongoDB (comma separated)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-stage" className="text-blue-200/80">Development Stage</Label>
                        <Select value={projectForm.developmentStage} onValueChange={(value) => setProjectForm(prev => ({ ...prev, developmentStage: value }))}>
                          <SelectTrigger className="bg-black/40 border-blue-500/30 text-blue-100">
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-blue-500/30">
                            <SelectItem value="concept">Concept</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="deployment">Deployment</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-team" className="text-blue-200/80">Team Members</Label>
                        <Input
                          id="project-team"
                          value={projectForm.teamMembers}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, teamMembers: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="John Doe, Jane Smith (comma separated)"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-description" className="text-blue-200/80">Detailed Description *</Label>
                        <Textarea
                          id="project-description"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500 min-h-[120px]"
                          placeholder="Describe your project in detail..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-video" className="text-blue-200/80">Video Link (Optional)</Label>
                        <Input
                          id="project-video"
                          value={projectForm.video}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, video: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-tags" className="text-blue-200/80">Tags</Label>
                        <Input
                          id="project-tags"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, tags: e.target.value }))}
                          className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                          placeholder="Web App, React, Full-stack (comma separated)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-200/80">Images</Label>
                        <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'project')}
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                          <p className="text-blue-200/80 mb-2">Drag and drop images here</p>
                          <p className="text-blue-200/60 text-sm mb-4">or click to browse files</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Select Images
                          </Button>
                        </div>
                        {projectForm.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {projectForm.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeImage(index, 'project')}
                                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-blue-500/30">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSubmitProject(true)}
                      disabled={uploading}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      {uploading ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmitProject(false)}
                      disabled={uploading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                    >
                      {uploading ? 'Submitting...' : 'Submit for Approval'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Activity Feed
                  </CardTitle>
                  <CardDescription className="text-blue-200/80">
                    Track your recent activities and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activity.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-4 p-4 bg-black/40 rounded-lg border border-blue-500/20"
                      >
                        <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                          {item.type === 'login' && <User className="w-5 h-5 text-blue-400" />}
                          {item.type === 'research' && <FileText className="w-5 h-5 text-blue-400" />}
                          {item.type === 'project' && <FolderOpen className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-100 mb-1">{item.title}</h4>
                          <p className="text-blue-200/80 text-sm mb-2">{item.description}</p>
                          <p className="text-blue-200/60 text-xs">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/90 border border-blue-500/30 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-blue-100">Edit Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-blue-200/80">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-blue-200/80">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-bio" className="text-blue-200/80">Bio</Label>
                  <Textarea
                    id="edit-bio"
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-black/40 border-blue-500/30 text-blue-100 placeholder-blue-200/50 focus:border-blue-500 min-h-[80px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditProfile}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}