'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { Users, FileText, FolderOpen, Link2, LogOut, Shield, CheckCircle, XCircle, Clock, Home, Info, Star, Settings, UserPlus, Mail, Eye, MapPin, Phone, Calendar, Briefcase, Award, Target, Users as UsersIcon, Github, Linkedin } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast, ToastContainer } from '@/hooks/useToast'
import HomepageSettingsForm from '@/components/admin/HomepageSettingsForm'
import AboutSettingsForm from '@/components/admin/AboutSettingsForm'
import FeaturedContentForm from '@/components/admin/FeaturedContentForm'
import SocialLinksForm from '@/components/admin/SocialLinksForm'
import SeoSettingsForm from '@/components/admin/SeoSettingsForm'
import TeamMembersForm from '@/components/admin/TeamMembersForm'
import LegalPagesForm from '@/components/admin/LegalPagesForm'
import AdminMenuBar from '@/components/admin/AdminMenuBar'
import FooterSection from '@/components/sections/FooterSection'

interface User {
  id: string
  email: string
  name?: string
  role: 'MEMBER' | 'ADMIN'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  phone?: string
  country?: string
  city?: string
  gender?: string
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
  registration?: {
    id: string
    motivation: string
    fieldCategory: string
    hasExperience: boolean
    experienceDescription?: string
    teamworkFeelings: string
    futureGoals: string
    skills: string
    otherSkills?: string
    hobbies: string
    availabilityDays: number
    availabilityHours: number
    linkedin?: string
    github?: string
    createdAt: string
    updatedAt: string
  }
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [stats, setStats] = useState({
    researchCount: 0,
    projectsCount: 0,
    socialLinksCount: 0,
    usersCount: 0,
    pendingUsersCount: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, loading: authLoading, isAdmin, logout } = useAuth()
  const { toast, toasts, dismiss } = useToast()

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/login')
        return
      }

      const fetchData = async () => {
        try {
          console.log('Fetching admin dashboard data...')
          
          // Fetch users
          const usersResponse = await fetch('/api/admin/users', {
            credentials: 'include'
          })
          console.log('Users response:', usersResponse.status)
          
          let usersData: User[] = []
          if (usersResponse.ok) {
            usersData = await usersResponse.json()
            console.log('Users data:', usersData)
            setUsers(usersData)
          } else {
            const errorData = await usersResponse.json()
            console.error('Users API error:', errorData)
            throw new Error(errorData.error || 'Failed to fetch users')
          }

          // Fetch stats
          const [researchRes, projectsRes, socialRes] = await Promise.all([
            fetch('/api/research'),
            fetch('/api/projects'),
            fetch('/api/social')
          ])

          console.log('Research response:', researchRes.status)
          console.log('Projects response:', projectsRes.status)
          console.log('Social response:', socialRes.status)

          const researchData = researchRes.ok ? await researchRes.json() : []
          const projectsData = projectsRes.ok ? await projectsRes.json() : []
          const socialData = socialRes.ok ? await socialRes.json() : []

          console.log('Research data:', researchData)
          console.log('Projects data:', projectsData)
          console.log('Social data:', socialData)

          setStats({
            researchCount: Array.isArray(researchData) ? researchData.length : 0,
            projectsCount: Array.isArray(projectsData) ? projectsData.length : 0,
            socialLinksCount: Array.isArray(socialData) ? socialData.length : 0,
            usersCount: usersData.length,
            pendingUsersCount: usersData.filter((u: User) => u.status === 'PENDING').length
          })
        } catch (err: any) {
          console.error('Dashboard data fetch error:', err)
          setError(`Failed to load dashboard data: ${err.message}`)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [user, authLoading, isAdmin, router])

  const handleLogout = async () => {
    await logout()
  }

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'suspend') => {
    try {
      console.log(`Performing ${action} on user ${userId}`)
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PATCH',
        credentials: 'include'
      })

      console.log('User action response:', response.status)

      if (response.ok) {
        // Refresh users list
        const usersResponse = await fetch('/api/admin/users', {
          credentials: 'include'
        })
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
          // Show success message
          toast.success(`User ${action}d successfully`)
        } else {
          throw new Error('Failed to refresh users list')
        }
      } else {
        const errorData = await response.json()
        console.error('User action error:', errorData)
        toast.error(errorData.error || `Failed to ${action} user`)
      }
    } catch (err) {
      console.error('Error updating user:', err)
      toast.error('An error occurred while updating user status')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription className="text-blue-200/80">
                Manage user registrations, approvals, and account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-blue-200/60">
                    Showing {users.length} users ({users.filter((u: User) => u.status === 'PENDING').length} pending)
                  </div>
                  <Button
                    onClick={() => router.push('/admin/users')}
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                  </Button>
                </div>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-blue-200/60">
                    No users found
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-blue-100">
                            {user.name || 'No Name'}
                          </div>
                          <div className="text-sm text-blue-200/60">{user.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              user.role === 'ADMIN' ? 'default' : 'secondary'
                            } className={
                              user.role === 'ADMIN' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-blue-600 text-white'
                            }>
                              {user.role}
                            </Badge>
                            <Badge variant={
                              user.status === 'APPROVED' ? 'default' : 
                              user.status === 'PENDING' ? 'secondary' : 'destructive'
                            } className={
                              user.status === 'APPROVED' ? 'bg-green-600 text-white' :
                              user.status === 'PENDING' ? 'bg-yellow-600 text-white' :
                              'bg-red-600 text-white'
                            }>
                              {user.status}
                            </Badge>
                            {user.registration && (
                              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                                <Briefcase className="w-3 h-3 mr-1" />
                                Registered
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.registration && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/95 backdrop-blur-xl border border-blue-500/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-blue-400 flex items-center gap-2">
                                  <Users className="w-5 h-5" />
                                  User Registration Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Basic Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-sm text-blue-200/60">Full Name</div>
                                      <div className="text-blue-100">{user.name || 'Not provided'}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-blue-200/60">Email</div>
                                      <div className="text-blue-100">{user.email}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-blue-200/60">Phone</div>
                                      <div className="text-blue-100 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {user.phone || 'Not provided'}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-blue-200/60">Location</div>
                                      <div className="text-blue-100 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {user.city && user.country ? `${user.city}, ${user.country}` : 'Not provided'}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-blue-200/60">Gender</div>
                                      <div className="text-blue-100">{user.gender || 'Not provided'}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-blue-200/60">Date of Birth</div>
                                      <div className="text-blue-100 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Registration Details */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    Registration Details
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="text-sm text-purple-200/60">Field Category</div>
                                      <div className="text-purple-100">{user.registration.fieldCategory}</div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-purple-200/60">Experience</div>
                                      <div className="text-purple-100">
                                        {user.registration.hasExperience ? 'Yes' : 'No'}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-purple-200/60">Availability</div>
                                      <div className="text-purple-100">
                                        {user.registration.availabilityDays} days, {user.registration.availabilityHours} hours/week
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-sm text-purple-200/60">Skills</div>
                                      <div className="text-purple-100">
                                        {user.registration.skills.split(',').map((skill, index) => (
                                          <Badge key={index} variant="secondary" className="mr-1 mb-1 bg-purple-600/20 text-purple-300">
                                            {skill.trim()}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Experience & Goals */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Experience & Goals
                                  </h3>
                                  <div className="space-y-4">
                                    {user.registration.motivation && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-green-200/60">Motivation</div>
                                        <div className="text-green-100 bg-green-500/10 p-3 rounded-lg">
                                          {user.registration.motivation}
                                        </div>
                                      </div>
                                    )}
                                    {user.registration.experienceDescription && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-green-200/60">Experience Description</div>
                                        <div className="text-green-100 bg-green-500/10 p-3 rounded-lg">
                                          {user.registration.experienceDescription}
                                        </div>
                                      </div>
                                    )}
                                    {user.registration.teamworkFeelings && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-green-200/60">Teamwork Feelings</div>
                                        <div className="text-green-100 bg-green-500/10 p-3 rounded-lg">
                                          {user.registration.teamworkFeelings}
                                        </div>
                                      </div>
                                    )}
                                    {user.registration.futureGoals && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-green-200/60">Future Goals</div>
                                        <div className="text-green-100 bg-green-500/10 p-3 rounded-lg">
                                          {user.registration.futureGoals}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    Additional Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    {user.registration.hobbies && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-yellow-200/60">Hobbies</div>
                                        <div className="text-yellow-100">{user.registration.hobbies}</div>
                                      </div>
                                    )}
                                    {user.registration.otherSkills && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-yellow-200/60">Other Skills</div>
                                        <div className="text-yellow-100">{user.registration.otherSkills}</div>
                                      </div>
                                    )}
                                    {user.registration.linkedin && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-yellow-200/60">LinkedIn</div>
                                        <div className="text-yellow-100">
                                          <a href={user.registration.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200">
                                            <Linkedin className="w-4 h-4" />
                                            View Profile
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                    {user.registration.github && (
                                      <div className="space-y-2">
                                        <div className="text-sm text-yellow-200/60">GitHub</div>
                                        <div className="text-yellow-100">
                                          <a href={user.registration.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200">
                                            <Github className="w-4 h-4" />
                                            View Profile
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {user.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'reject')}
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === 'APPROVED' && (
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            variant="outline"
                            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 'registrations':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Registration Management
              </CardTitle>
              <CardDescription className="text-purple-200/80">
                View and manage all user registration applications with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-purple-200/60">
                    Manage registration applications, view detailed user information, and process approvals
                  </div>
                  <Button
                    onClick={() => router.push('/admin/registrations')}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Manage Registrations
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-black/50 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-200/60">Total</p>
                          <p className="text-xl font-bold text-purple-100">{stats.usersCount}</p>
                        </div>
                        <Users className="h-6 w-6 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-yellow-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-200/60">Pending</p>
                          <p className="text-xl font-bold text-yellow-100">{stats.pendingUsersCount}</p>
                        </div>
                        <Clock className="h-6 w-6 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-200/60">Approved</p>
                          <p className="text-xl font-bold text-green-100">{users.filter((u: User) => u.status === 'APPROVED').length}</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-red-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-200/60">Rejected</p>
                          <p className="text-xl font-bold text-red-100">{users.filter((u: User) => u.status === 'REJECTED').length}</p>
                        </div>
                        <XCircle className="h-6 w-6 text-red-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'team':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Team Management
              </CardTitle>
              <CardDescription className="text-cyan-200/80">
                Manage team members, roles, and profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembersForm />
            </CardContent>
          </Card>
        )

      case 'contact':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Management
              </CardTitle>
              <CardDescription className="text-green-200/80">
                View and manage contact form submissions from website visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-green-200/60">
                    Manage contact submissions, respond to inquiries, and track communication
                  </div>
                  <Button
                    onClick={() => router.push('/admin/contact')}
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    View All Messages
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/50 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-200/60">Total Messages</p>
                          <p className="text-xl font-bold text-blue-100">12</p>
                        </div>
                        <Mail className="h-6 w-6 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-yellow-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-200/60">This Week</p>
                          <p className="text-xl font-bold text-yellow-100">3</p>
                        </div>
                        <Clock className="h-6 w-6 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-200/60">Responded</p>
                          <p className="text-xl font-bold text-green-100">8</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'images':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Image Management
              </CardTitle>
              <CardDescription className="text-yellow-200/80">
                Upload, organize, and manage images across the website with folder organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-yellow-200/60">
                    Manage image uploads, organize by folders, and track image usage statistics
                  </div>
                  <Button
                    onClick={() => router.push('/admin/images')}
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Images
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-black/50 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-200/60">Total Images</p>
                          <p className="text-xl font-bold text-blue-100">24</p>
                        </div>
                        <FileText className="h-6 w-6 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-200/60">Storage Used</p>
                          <p className="text-xl font-bold text-green-100">45MB</p>
                        </div>
                        <FolderOpen className="h-6 w-6 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-yellow-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-200/60">Featured</p>
                          <p className="text-xl font-bold text-yellow-100">8</p>
                        </div>
                        <Star className="h-6 w-6 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-cyan-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-cyan-200/60">Folders</p>
                          <p className="text-xl font-bold text-cyan-100">4</p>
                        </div>
                        <FolderOpen className="h-6 w-6 text-cyan-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'homepage':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-indigo-400 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Homepage Settings
              </CardTitle>
              <CardDescription className="text-indigo-200/80">
                Manage your homepage hero section, banner, and call-to-action buttons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HomepageSettingsForm />
            </CardContent>
          </Card>
        )

      case 'about':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-pink-500/30 shadow-2xl shadow-pink-500/20">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center gap-2">
                <Info className="w-5 h-5" />
                About Settings
              </CardTitle>
              <CardDescription className="text-pink-200/80">
                Manage your about section content and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AboutSettingsForm />
            </CardContent>
          </Card>
        )

      case 'featured':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-orange-500/20">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Featured Content
              </CardTitle>
              <CardDescription className="text-orange-200/80">
                Manage featured research and projects displayed on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeaturedContentForm />
            </CardContent>
          </Card>
        )

      case 'content':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-teal-500/30 shadow-2xl shadow-teal-500/20">
            <CardHeader>
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Content Management
              </CardTitle>
              <CardDescription className="text-teal-200/80">
                Manage research papers and project details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Research Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-300 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Research Papers
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white justify-start"
                      onClick={() => router.push('/admin/research')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Research Papers
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-500/10 justify-start"
                      onClick={() => router.push('/research')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Research Papers
                    </Button>
                  </div>
                </div>

                {/* Projects Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-300 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    Projects
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white justify-start"
                      onClick={() => router.push('/admin/projects')}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Manage Projects
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-500/10 justify-start"
                      onClick={() => router.push('/projects')}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      View Projects
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
                <h4 className="text-sm font-medium text-teal-300 mb-2">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-200/80">Total Research:</span>
                    <span className="text-teal-300 font-medium">{stats.researchCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-200/80">Total Projects:</span>
                    <span className="text-teal-300 font-medium">{stats.projectsCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'social':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-lime-500/30 shadow-2xl shadow-lime-500/20">
            <CardHeader>
              <CardTitle className="text-lime-400 flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                Social Links
              </CardTitle>
              <CardDescription className="text-lime-200/80">
                Manage social media links and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialLinksForm />
            </CardContent>
          </Card>
        )

      case 'legal':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-red-500/30 shadow-2xl shadow-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Legal Pages
              </CardTitle>
              <CardDescription className="text-red-200/80">
                Manage privacy policy, terms of service, and cookie policy content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalPagesForm />
            </CardContent>
          </Card>
        )

      case 'seo':
        return (
          <Card className="bg-black/80 backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-400 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                SEO Settings
              </CardTitle>
              <CardDescription className="text-violet-200/80">
                Manage SEO settings and meta information for better search engine visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SeoSettingsForm />
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-200">Loading admin dashboard...</p>
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

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-xl text-blue-200/80">Manage your Arive Lab website and users</p>
              <p className="text-sm text-blue-200/60 mt-1">Welcome, {user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Research Items</CardTitle>
              <FileText className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-100">{stats.researchCount}</div>
              <p className="text-xs text-blue-200/60">Active research items</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Projects</CardTitle>
              <FolderOpen className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-100">{stats.projectsCount}</div>
              <p className="text-xs text-purple-200/60">Active projects</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">Social Links</CardTitle>
              <Link2 className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-100">{stats.socialLinksCount}</div>
              <p className="text-xs text-cyan-200/60">Social media links</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Total Users</CardTitle>
              <Users className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">{stats.usersCount}</div>
              <p className="text-xs text-green-200/60">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">Pending</CardTitle>
              <Clock className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-100">{stats.pendingUsersCount}</div>
              <p className="text-xs text-yellow-200/60">Awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Menu Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AdminMenuBar activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6"
        >
          {renderContent()}
        </motion.div>
        
        {/* Toast Container */}
        <ToastContainer toasts={toasts} dismiss={dismiss} />
        
        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  )
}