'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail,
  Crown,
  Shield,
  Users2,
  ArrowRight
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
  MEMBER: Users,
  INTERN: Users
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

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('TeamSection: useEffect triggered')
    fetchFeaturedTeamMembers()
  }, [])

  const fetchFeaturedTeamMembers = async () => {
    try {
      console.log('Fetching featured team members...')
      const response = await fetch('/api/team-members?featured=true')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Team members data:', data)
        setTeamMembers(data)
      } else {
        console.error('API response not ok:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching featured team members:', error)
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-purple-500 mr-4" />
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Leadership Team (Loading...)
              </h2>
            </div>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-400">Loading team members...</p>
            <p className="text-purple-300 text-sm mt-2">Debug: Checking API connection</p>
          </div>
        </div>
      </section>
    )
  }

  if (teamMembers.length === 0) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-purple-500 mr-4" />
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Leadership Team
              </h2>
            </div>
            <p className="text-purple-300">No featured team members found.</p>
            <p className="text-purple-300 text-sm mt-2">Debug: Team members array is empty</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-900/10 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-purple-500 mr-4" />
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Leadership Team
            </h2>
          </div>
          <p className="text-xl text-purple-300 max-w-3xl mx-auto mb-8">
            Meet the visionary leaders driving our automotive innovation forward
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {teamMembers.map((member) => {
            const IconComponent = roleIcons[member.teamRole]
            
            return (
              <Card 
                key={member.id} 
                className="bg-purple-900/10 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-purple-500/50 group-hover:border-purple-400 transition-all duration-300">
                        <AvatarImage src={member.image || ''} alt={member.name} />
                        <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleColors[member.teamRole]}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {member.name}
                  </h3>
                  
                  <p className="text-purple-300 mb-3">{member.role}</p>
                  
                  <Badge className={`${roleColors[member.teamRole]} mb-4`}>
                    {roleLabels[member.teamRole]}
                  </Badge>
                  
                  {member.bio && (
                    <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                  
                  <div className="flex justify-center space-x-3">
                    {member.email && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        asChild
                      >
                        <a href={`mailto:${member.email}`}>
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.linkedin && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        asChild
                      >
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.twitter && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        asChild
                      >
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.github && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        asChild
                      >
                        <a href={member.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50"
          >
            <Link href="/team" className="flex items-center">
              Meet the Full Team
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}