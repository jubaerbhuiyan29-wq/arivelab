import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featuredOnly = searchParams.get('featured') === 'true'
    
    let teamMembers
    
    if (featuredOnly) {
      // Only show founder, admin, and coordinators on home page
      teamMembers = await db.teamMember.findMany({
        where: {
          teamRole: {
            in: ['FOUNDER', 'ADMIN', 'COORDINATOR']
          }
        },
        orderBy: { displayOrder: 'asc' }
      })
    } else {
      // Show all team members on team page
      teamMembers = await db.teamMember.findMany({
        orderBy: { displayOrder: 'asc' }
      })
    }

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const teamMember = await db.teamMember.create({
      data: {
        ...body,
        teamRole: body.teamRole || 'MEMBER'
      }
    })
    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}