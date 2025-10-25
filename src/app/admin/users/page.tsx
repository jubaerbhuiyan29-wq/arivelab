'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  Target,
  Users as UsersIcon,
  Star,
  Link as LinkIcon,
  Github,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface User {
  id: string
  email: string
  name?: string
  role: 'MEMBER' | 'ADMIN'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  createdAt: string
  phone?: string
  gender?: string
  dateOfBirth?: string
  country?: string
  city?: string
  profilePhoto?: string
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
  }
}

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/login')
        return
      }

      fetchUsers()
    }
  }, [user, authLoading, isAdmin, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'suspend') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PATCH'
      })

      if (response.ok) {
        await fetchUsers()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openUserDetails = (user: User) => {
    setSelectedUser(user)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-blue-200">Loading users...</p>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-blue-200/80">Manage user registrations and view detailed information</p>
            </div>
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Users ({users.length})
              </CardTitle>
              <CardDescription className="text-blue-200/80">
                Click on a user to view their complete registration details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <div className="text-center py-8 text-blue-200/60">
                    No users found
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          {user.profilePhoto ? (
                            <img 
                              src={user.profilePhoto} 
                              alt={user.name || 'User'} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-white" />
                          )}
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
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUserDetails(user)}
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border border-blue-500/30 max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-blue-400 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                User Registration Details
                              </DialogTitle>
                              <DialogDescription className="text-blue-200/80">
                                Complete registration information for {selectedUser?.name || selectedUser?.email}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedUser ? (
                              <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                  <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Personal Information
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-200">{selectedUser.email}</span>
                                      </div>
                                      {selectedUser.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-blue-400" />
                                          <span className="text-blue-200">{selectedUser.phone}</span>
                                        </div>
                                      )}
                                      {selectedUser.dateOfBirth && (
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4 text-blue-400" />
                                          <span className="text-blue-200">
                                            Born: {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="space-y-3">
                                      {selectedUser.country && (
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-blue-400" />
                                          <span className="text-blue-200">
                                            {selectedUser.city}, {selectedUser.country}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <span className="text-blue-400">Gender:</span>
                                        <span className="text-blue-200">{selectedUser.gender}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-blue-400">Status:</span>
                                        <Badge className={
                                          selectedUser.status === 'APPROVED' ? 'bg-green-600 text-white' :
                                          selectedUser.status === 'PENDING' ? 'bg-yellow-600 text-white' :
                                          'bg-red-600 text-white'
                                        }>
                                          {selectedUser.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Registration Details */}
                                {selectedUser.registration && (
                                  <div>
                                    <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                      <Briefcase className="w-5 h-5" />
                                      Registration Details
                                    </h3>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Field Category</label>
                                        <p className="text-purple-200">{selectedUser.registration.fieldCategory}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Motivation</label>
                                        <p className="text-purple-200">{selectedUser.registration.motivation}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Experience</label>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge variant={selectedUser.registration.hasExperience ? 'default' : 'secondary'}>
                                            {selectedUser.registration.hasExperience ? 'Has Experience' : 'No Experience'}
                                          </Badge>
                                        </div>
                                        {selectedUser.registration.experienceDescription && (
                                          <p className="text-purple-200">{selectedUser.registration.experienceDescription}</p>
                                        )}
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Skills</label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {selectedUser.registration.skills.split(',').map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {skill.trim()}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Availability</label>
                                        <p className="text-purple-200">
                                          {selectedUser.registration.availabilityDays} days per week, {selectedUser.registration.availabilityHours} hours per day
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Teamwork Feelings</label>
                                        <p className="text-purple-200">{selectedUser.registration.teamworkFeelings}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-purple-300">Future Goals</label>
                                        <p className="text-purple-200">{selectedUser.registration.futureGoals}</p>
                                      </div>
                                      {selectedUser.registration.otherSkills && (
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Other Skills</label>
                                          <p className="text-purple-200">{selectedUser.registration.otherSkills}</p>
                                        </div>
                                      )}
                                      {selectedUser.registration.hobbies && (
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Hobbies</label>
                                          <p className="text-purple-200">{selectedUser.registration.hobbies}</p>
                                        </div>
                                      )}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedUser.registration.linkedin && (
                                          <div>
                                            <label className="text-sm font-medium text-purple-300">LinkedIn</label>
                                            <a 
                                              href={selectedUser.registration.linkedin} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 text-purple-300 hover:text-purple-200"
                                            >
                                              <LinkIcon className="w-4 h-4" />
                                              View Profile
                                            </a>
                                          </div>
                                        )}
                                        {selectedUser.registration.github && (
                                          <div>
                                            <label className="text-sm font-medium text-purple-300">GitHub</label>
                                            <a 
                                              href={selectedUser.registration.github} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 text-purple-300 hover:text-purple-200"
                                            >
                                              <Github className="w-4 h-4" />
                                              View Profile
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                                  {selectedUser.status === 'PENDING' && (
                                    <>
                                      <Button
                                        onClick={() => handleUserAction(selectedUser.id, 'approve')}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleUserAction(selectedUser.id, 'reject')}
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  {selectedUser.status === 'APPROVED' && (
                                    <Button
                                      onClick={() => handleUserAction(selectedUser.id, 'suspend')}
                                      variant="outline"
                                      className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                                    >
                                      <Clock className="w-4 h-4 mr-2" />
                                      Suspend
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-blue-200/60">
                                No user selected
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}