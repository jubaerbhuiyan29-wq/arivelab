'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  Phone,
  Crown,
  Shield,
  Users2,
  User,
  GraduationCap
} from 'lucide-react'
import FooterSection from '@/components/sections/FooterSection'

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

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

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

  const groupedMembers = teamMembers.reduce((acc, member) => {
    if (!acc[member.teamRole]) {
      acc[member.teamRole] = []
    }
    acc[member.teamRole].push(member)
    return acc
  }, {} as Record<string, TeamMember[]>)

  const roleOrder = ['FOUNDER', 'ADMIN', 'COORDINATOR', 'MEMBER', 'INTERN']

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-400">Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-purple-500 mr-4" />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Our Team
              </h1>
            </div>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Meet the passionate individuals driving innovation and excellence in automotive research and development.
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-12 bg-purple-900/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              All
            </TabsTrigger>
            {roleOrder.map((role) => (
              <TabsTrigger 
                key={role} 
                value={role.toLowerCase()}
                className="data-[state=active]:bg-purple-600"
              >
                {roleLabels[role as keyof typeof roleLabels]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-12">
            {roleOrder.map((role) => {
              const members = groupedMembers[role] || []
              if (members.length === 0) return null

              const IconComponent = roleIcons[role as keyof typeof roleIcons]

              return (
                <div key={role} className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-8 h-8 text-purple-500" />
                    <h2 className="text-3xl font-bold text-white">
                      {roleLabels[role as keyof typeof roleLabels]}{members.length > 1 ? 's' : ''}
                    </h2>
                    <Badge className={roleColors[role as keyof typeof roleColors]}>
                      {members.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                      <Card 
                        key={member.id} 
                        className="bg-purple-900/10 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        <CardHeader className="text-center pb-4">
                          <div className="flex justify-center mb-4">
                            <Avatar className="w-24 h-24 border-4 border-purple-500/50">
                              <AvatarImage src={member.image} alt={member.name} />
                              <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <CardTitle className="text-xl text-white">{member.name}</CardTitle>
                          <p className="text-purple-300">{member.role}</p>
                          <Badge className={roleColors[member.teamRole]}>
                            {roleLabels[member.teamRole]}
                          </Badge>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {member.bio && (
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                              {member.bio}
                            </p>
                          )}
                          <div className="flex justify-center space-x-3">
                            {member.email && (
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                <Mail className="w-4 h-4" />
                              </Button>
                            )}
                            {member.linkedin && (
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                <Linkedin className="w-4 h-4" />
                              </Button>
                            )}
                            {member.twitter && (
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                <Twitter className="w-4 h-4" />
                              </Button>
                            )}
                            {member.github && (
                              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                <Github className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>

          {roleOrder.map((role) => {
            const members = groupedMembers[role] || []
            if (members.length === 0) return null

            return (
              <TabsContent key={role} value={role.toLowerCase()} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <Card 
                      key={member.id} 
                      className="bg-purple-900/10 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          <Avatar className="w-24 h-24 border-4 border-purple-500/50">
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className="text-xl text-white">{member.name}</CardTitle>
                        <p className="text-purple-300">{member.role}</p>
                        <Badge className={roleColors[member.teamRole]}>
                          {roleLabels[member.teamRole]}
                        </Badge>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {member.bio && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                            {member.bio}
                          </p>
                        )}
                        <div className="flex justify-center space-x-3">
                          {member.email && (
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {member.linkedin && (
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                              <Linkedin className="w-4 h-4" />
                            </Button>
                          )}
                          {member.twitter && (
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                              <Twitter className="w-4 h-4" />
                            </Button>
                          )}
                          {member.github && (
                            <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20 border-4 border-purple-500/50">
                    <AvatarImage src={selectedMember.image} alt={selectedMember.name} />
                    <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
                      {selectedMember.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedMember.name}</h2>
                    <p className="text-xl text-purple-300">{selectedMember.role}</p>
                    <Badge className={roleColors[selectedMember.teamRole]}>
                      {roleLabels[selectedMember.teamRole]}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedMember(null)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  ×
                </Button>
              </div>

              {selectedMember.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Biography</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedMember.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedMember.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      {selectedMember.email}
                    </a>
                  </div>
                )}
                {selectedMember.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <a 
                      href={`tel:${selectedMember.phone}`}
                      className="text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      {selectedMember.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                {selectedMember.linkedin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(selectedMember.linkedin, '_blank')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {selectedMember.twitter && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(selectedMember.twitter, '_blank')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                )}
                {selectedMember.github && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(selectedMember.github, '_blank')}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}