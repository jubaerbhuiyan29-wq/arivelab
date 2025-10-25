'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  Check, 
  X, 
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  Star,
  Github,
  Linkedin,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface Registration {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  dateOfBirth: string
  country: string
  city: string
  profilePhoto?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  role: 'MEMBER' | 'ADMIN'
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

interface RegistrationsResponse {
  registrations: Registration[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/login')
        return
      }
      fetchRegistrations()
    }
  }, [user, authLoading, isAdmin, router, pagination.page, pagination.limit, statusFilter])

  useEffect(() => {
    if (searchTerm) {
      const filtered = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.registration?.fieldCategory.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRegistrations(filtered)
    } else {
      setFilteredRegistrations(registrations)
    }
  }, [registrations, searchTerm])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/registrations?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch registrations')
      }

      const data: RegistrationsResponse = await response.json()
      setRegistrations(data.registrations)
      setFilteredRegistrations(data.registrations)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      setError('Failed to load registrations')
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // Map status to action
      const statusToAction = {
        'APPROVED': 'approve',
        'REJECTED': 'reject',
        'SUSPENDED': 'suspend'
      }
      
      const action = statusToAction[newStatus as keyof typeof statusToAction]
      
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setRegistrations(prev => prev.map(reg => 
        reg.id === userId ? { ...reg, status: newStatus as any } : reg
      ))

      toast.success(`User status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user and their registration?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/registrations?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete registration')
      }

      setRegistrations(prev => prev.filter(reg => reg.id !== userId))
      toast.success('Registration deleted successfully')
    } catch (error) {
      console.error('Error deleting registration:', error)
      toast.error('Failed to delete registration')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'secondary',
      APPROVED: 'default',
      REJECTED: 'destructive',
      SUSPENDED: 'outline'
    } as const

    const classes = {
      PENDING: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50',
      APPROVED: 'bg-green-600/20 text-green-400 border-green-500/50',
      REJECTED: 'bg-red-600/20 text-red-400 border-red-500/50',
      SUSPENDED: 'bg-gray-600/20 text-gray-400 border-gray-500/50'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={classes[status as keyof typeof classes]}>
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Country', 'City', 'Status', 
      'Field Category', 'Experience', 'Skills', 'Availability', 'Created At'
    ]

    const csvData = filteredRegistrations.map(reg => [
      reg.name,
      reg.email,
      reg.phone,
      reg.country,
      reg.city,
      reg.status,
      reg.registration?.fieldCategory || '',
      reg.registration?.hasExperience ? 'Yes' : 'No',
      reg.registration?.skills || '',
      `${reg.registration?.availabilityDays || 0} days, ${reg.registration?.availabilityHours || 0} hours`,
      formatDate(reg.createdAt)
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-blue-200">Loading registrations...</p>
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
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-blue-400" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Registration Management
                  </h1>
                </div>
                <p className="text-xl text-blue-200/80">Manage user registrations and applications</p>
              </div>
            </div>
            <Button onClick={exportToCSV} variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-200">Total</p>
                  <p className="text-2xl font-bold text-blue-100">{pagination.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-200">Pending</p>
                  <p className="text-2xl font-bold text-yellow-100">
                    {registrations.filter(r => r.status === 'PENDING').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-200">Approved</p>
                  <p className="text-2xl font-bold text-green-100">
                    {registrations.filter(r => r.status === 'APPROVED').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-red-500/30 shadow-2xl shadow-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-200">Rejected</p>
                  <p className="text-2xl font-bold text-red-100">
                    {registrations.filter(r => r.status === 'REJECTED').length}
                  </p>
                </div>
                <X className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-400">Registration Applications</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      placeholder="Search registrations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-black/50 border-blue-500/30 text-blue-100 placeholder-blue-200/50"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-black/50 border-blue-500/30 text-blue-100">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-blue-500/30">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-blue-500/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-500/20">
                      <TableHead className="text-blue-200">Name</TableHead>
                      <TableHead className="text-blue-200">Email</TableHead>
                      <TableHead className="text-blue-200">Country</TableHead>
                      <TableHead className="text-blue-200">Status</TableHead>
                      <TableHead className="text-blue-200">Field</TableHead>
                      <TableHead className="text-blue-200">Applied</TableHead>
                      <TableHead className="text-blue-200 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id} className="border-blue-500/10 hover:bg-blue-500/5">
                        <TableCell className="font-medium text-blue-100">
                          <div className="flex items-center gap-2">
                            {registration.profilePhoto && (
                              <img
                                src={registration.profilePhoto}
                                alt={registration.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{registration.name}</div>
                              <div className="text-sm text-blue-200/60">{registration.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-blue-200/80">{registration.email}</TableCell>
                        <TableCell className="text-blue-200/80">{registration.country}</TableCell>
                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                        <TableCell className="text-blue-200/80">{registration.registration?.fieldCategory}</TableCell>
                        <TableCell className="text-blue-200/80">{formatDate(registration.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRegistration(registration)}
                                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-black/90 backdrop-blur-xl border border-blue-500/30 max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-blue-400 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Registration Details
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedRegistration && (
                                  <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                      <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-blue-300">Full Name</label>
                                          <p className="mt-1 text-blue-100">{selectedRegistration.name}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-blue-300">Email</label>
                                          <p className="mt-1 text-blue-100">{selectedRegistration.email}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-blue-300">Phone</label>
                                          <p className="mt-1 text-blue-100">{selectedRegistration.phone}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-blue-300">Gender</label>
                                          <p className="mt-1 text-blue-100">{selectedRegistration.gender}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-blue-300">Date of Birth</label>
                                          <p className="mt-1 text-blue-100">{formatDate(selectedRegistration.dateOfBirth)}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-blue-300">Status</label>
                                          <p className="mt-1">{getStatusBadge(selectedRegistration.status)}</p>
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-sm font-medium text-blue-300">Address</label>
                                          <p className="mt-1 flex items-center gap-1 text-blue-100">
                                            <MapPin className="h-4 w-4 text-blue-400" />
                                            {selectedRegistration.city}, {selectedRegistration.country}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Registration Details */}
                                    <div>
                                      <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Registration Details
                                      </h3>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Field Category</label>
                                          <p className="text-purple-200">{selectedRegistration.registration?.fieldCategory}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Motivation</label>
                                          <p className="text-purple-200">{selectedRegistration.registration?.motivation}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Experience</label>
                                          <div className="flex items-center gap-2 mb-2">
                                            <Badge variant={selectedRegistration.registration?.hasExperience ? 'default' : 'secondary'}>
                                              {selectedRegistration.registration?.hasExperience ? 'Has Experience' : 'No Experience'}
                                            </Badge>
                                          </div>
                                          {selectedRegistration.registration?.experienceDescription && (
                                            <p className="text-purple-200">{selectedRegistration.registration.experienceDescription}</p>
                                          )}
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Skills</label>
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedRegistration.registration?.skills 
                                              ? selectedRegistration.registration.skills.split(', ').map((skill, index) => (
                                                  <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                                    {skill.trim()}
                                                  </Badge>
                                                ))
                                              : <p className="text-purple-200">No skills specified</p>
                                            }
                                          </div>
                                        </div>
                                        {selectedRegistration.registration?.otherSkills && (
                                          <div>
                                            <label className="text-sm font-medium text-purple-300">Other Skills</label>
                                            <p className="text-purple-200">{selectedRegistration.registration.otherSkills}</p>
                                          </div>
                                        )}
                                        <div>
                                          <label className="text-sm font-medium text-purple-300">Availability</label>
                                          <p className="text-purple-200">
                                            {selectedRegistration.registration?.availabilityDays} days, {selectedRegistration.registration?.availabilityHours} hours per week
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div>
                                      <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Additional Information
                                      </h3>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium text-green-300">Teamwork Feelings</label>
                                          <p className="text-green-200">{selectedRegistration.registration?.teamworkFeelings}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-green-300">Future Goals</label>
                                          <p className="text-green-200">{selectedRegistration.registration?.futureGoals}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-green-300">Hobbies</label>
                                          <p className="text-green-200">{selectedRegistration.registration?.hobbies}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          {selectedRegistration.registration?.linkedin && (
                                            <div>
                                              <label className="text-sm font-medium text-green-300">LinkedIn</label>
                                              <p className="text-green-200 flex items-center gap-1">
                                                <Linkedin className="h-4 w-4" />
                                                {selectedRegistration.registration.linkedin}
                                              </p>
                                            </div>
                                          )}
                                          {selectedRegistration.registration?.github && (
                                            <div>
                                              <label className="text-sm font-medium text-green-300">GitHub</label>
                                              <p className="text-green-200 flex items-center gap-1">
                                                <Github className="h-4 w-4" />
                                                {selectedRegistration.registration.github}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Application Date */}
                                    <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm text-blue-300">Applied:</span>
                                        <span className="text-blue-100">{formatDate(selectedRegistration.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {/* Approval/Rejection Buttons */}
                            {registration.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(registration.id, 'APPROVED')}
                                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(registration.id, 'REJECTED')}
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {/* Suspend/Reactivate Buttons */}
                            {registration.status === 'APPROVED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(registration.id, 'SUSPENDED')}
                                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {registration.status === 'SUSPENDED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(registration.id, 'APPROVED')}
                                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(registration.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}