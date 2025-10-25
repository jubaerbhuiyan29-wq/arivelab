'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  Phone,
  Crown,
  Shield,
  Users2,
  User,
  GraduationCap,
  Upload
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  teamRole: 'FOUNDER' | 'ADMIN' | 'COORDINATOR' | 'MEMBER' | 'INTERN'
  bio?: string
  image?: string
  email?: string
  phone?: string
  linkedin?: string
  twitter?: string
  github?: string
  displayOrder: number
}

const roleIcons = {
  FOUNDER: Crown,
  ADMIN: Shield,
  COORDINATOR: Users2,
  MEMBER: User,
  INTERN: GraduationCap
}

const roleColors = {
  FOUNDER: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  ADMIN: 'bg-red-500/10 text-red-600 border-red-500/30',
  COORDINATOR: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  MEMBER: 'bg-green-500/10 text-green-600 border-green-500/30',
  INTERN: 'bg-purple-500/10 text-purple-600 border-purple-500/30'
}

const roleLabels = {
  FOUNDER: 'Founder',
  ADMIN: 'Admin',
  COORDINATOR: 'Coordinator',
  MEMBER: 'Member',
  INTERN: 'Intern'
}

export default function TeamMembersForm() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    teamRole: 'MEMBER' as const,
    bio: '',
    email: '',
    phone: '',
    linkedin: '',
    twitter: '',
    github: '',
    image: '',
    displayOrder: 0
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', 'profile')

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        handleInputChange('image', data.url)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMember ? `/api/team-members/${editingMember.id}` : '/api/team-members'
      const method = editingMember ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchTeamMembers()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      teamRole: member.teamRole,
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      github: member.github || '',
      image: member.image || '',
      displayOrder: member.displayOrder
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTeamMembers()
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      teamRole: 'MEMBER',
      bio: '',
      email: '',
      phone: '',
      linkedin: '',
      twitter: '',
      github: '',
      image: '',
      displayOrder: 0
    })
    setEditingMember(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-purple-400">Team Members</h3>
          <p className="text-sm text-purple-300/80">Manage your team members and their roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-purple-900/20 border-purple-500/30 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-purple-400">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </DialogTitle>
              <DialogDescription className="text-purple-300/80">
                {editingMember ? 'Update team member information' : 'Add a new team member to your organization'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-300">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-purple-300">Position/Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamRole" className="text-purple-300">Team Role</Label>
                  <Select 
                    value={formData.teamRole} 
                    onValueChange={(value) => handleInputChange('teamRole', value)}
                  >
                    <SelectTrigger className="bg-purple-900/20 border-purple-500/30 text-purple-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOUNDER">Founder</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="COORDINATOR">Coordinator</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="INTERN">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder" className="text-purple-300">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value))}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-purple-300">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-purple-300">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-purple-300">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-purple-300">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-purple-300">GitHub URL</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="bg-purple-900/20 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-purple-300">Profile Image</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('image')?.click()}
                    disabled={uploading}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {formData.image && (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={formData.image} alt="Preview" />
                      <AvatarFallback>Preview</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {editingMember ? 'Update' : 'Add'} Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {teamMembers.map((member) => {
          const IconComponent = roleIcons[member.teamRole]
          
          return (
            <Card key={member.id} className="bg-purple-900/10 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-purple-500/50">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-purple-100">{member.name}</h4>
                        <Badge className={roleColors[member.teamRole]}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {roleLabels[member.teamRole]}
                        </Badge>
                      </div>
                      <p className="text-purple-300 mb-2">{member.role}</p>
                      {member.bio && (
                        <p className="text-sm text-purple-200/70 line-clamp-2">{member.bio}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-2">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-purple-400 hover:text-purple-300">
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-purple-900/20 border-purple-500/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-400">Delete Team Member</AlertDialogTitle>
                          <AlertDialogDescription className="text-purple-300/80">
                            Are you sure you want to delete {member.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(member.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12 text-purple-300/60">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No team members found. Add your first team member to get started.</p>
        </div>
      )}
    </div>
  )
}