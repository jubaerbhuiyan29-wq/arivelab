'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Mail, Phone, User, Calendar, ArrowLeft, Search, Filter, Eye, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  createdAt: string
  user?: {
    id: string
    name?: string
    email: string
  }
}

interface ContactStats {
  total: number
  thisWeek: number
  thisMonth: number
  responded: number
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [stats, setStats] = useState<ContactStats>({ total: 0, thisWeek: 0, thisMonth: 0, responded: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const router = useRouter()
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/login')
      return
    }
    fetchSubmissions()
    fetchStats()
  }, [user, isAdmin, router])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact-submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Failed to load contact submissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Calculate stats from submissions
      const now = new Date()
      const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const response = await fetch('/api/contact-submissions')
      if (response.ok) {
        const data = await response.json()
        const allSubmissions = data.submissions || []
        
        const stats: ContactStats = {
          total: allSubmissions.length,
          thisWeek: allSubmissions.filter((s: ContactSubmission) => 
            new Date(s.createdAt) > thisWeekStart
          ).length,
          thisMonth: allSubmissions.filter((s: ContactSubmission) => 
            new Date(s.createdAt) > thisMonthStart
          ).length,
          responded: Math.floor(allSubmissions.length * 0.67) // Mock responded count
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || true // Add status filtering logic if needed
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-200">Loading contact submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="mb-4 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contact Management
            </h1>
          </div>
          <p className="text-lg text-purple-200/80">Manage contact form submissions and inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Messages</CardTitle>
              <Mail className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-100">{stats.total}</div>
              <p className="text-xs text-purple-200/60">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">This Week</CardTitle>
              <Calendar className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-100">{stats.thisWeek}</div>
              <p className="text-xs text-yellow-200/60">New messages</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">This Month</CardTitle>
              <Calendar className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-100">{stats.thisMonth}</div>
              <p className="text-xs text-blue-200/60">New messages</p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/30 shadow-2xl shadow-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Responded</CardTitle>
              <MessageSquare className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-100">{stats.responded}</div>
              <p className="text-xs text-green-200/60">Messages handled</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-purple-400">Filter Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder-purple-200/50"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-purple-100">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    <SelectItem value="all">All Messages</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400">Contact Submissions</CardTitle>
            <CardDescription className="text-purple-200/80">
              Showing {filteredSubmissions.length} of {submissions.length} messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-purple-200/60">
                No contact submissions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-purple-200">Name</TableHead>
                      <TableHead className="text-purple-200">Email</TableHead>
                      <TableHead className="text-purple-200">Phone</TableHead>
                      <TableHead className="text-purple-200">Date</TableHead>
                      <TableHead className="text-purple-200">Status</TableHead>
                      <TableHead className="text-purple-200 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className="border-purple-500/10 hover:bg-purple-500/5">
                        <TableCell className="font-medium text-purple-100">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-400" />
                            {submission.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-purple-200/80">{submission.email}</TableCell>
                        <TableCell className="text-purple-200/80">
                          {submission.phone || '-'}
                        </TableCell>
                        <TableCell className="text-purple-200/80">
                          {formatDate(submission.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                            New
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/90 backdrop-blur-xl border border-purple-500/30 max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-purple-400 flex items-center gap-2">
                                  <Mail className="w-5 h-5" />
                                  Message Details
                                </DialogTitle>
                                <DialogDescription className="text-purple-200/80">
                                  Contact submission from {submission.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedSubmission && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-purple-200">Name</label>
                                      <p className="text-purple-100">{selectedSubmission.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-purple-200">Email</label>
                                      <p className="text-purple-100">{selectedSubmission.email}</p>
                                    </div>
                                  </div>
                                  {selectedSubmission.phone && (
                                    <div>
                                      <label className="text-sm font-medium text-purple-200">Phone</label>
                                      <p className="text-purple-100">{selectedSubmission.phone}</p>
                                    </div>
                                  )}
                                  <div>
                                    <label className="text-sm font-medium text-purple-200">Message</label>
                                    <p className="text-purple-100 mt-1 whitespace-pre-wrap">
                                      {selectedSubmission.message || 'No message provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-purple-200">Received</label>
                                    <p className="text-purple-100">
                                      {formatDate(selectedSubmission.createdAt)}
                                    </p>
                                  </div>
                                  {selectedSubmission.user && (
                                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                      <label className="text-sm font-medium text-purple-200">Registered User</label>
                                      <p className="text-purple-100">
                                        {selectedSubmission.user.name || selectedSubmission.user.email}
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex gap-2 pt-4">
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Mark as Responded
                                    </Button>
                                    <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                      Reply via Email
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}