import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: 'MEMBER' | 'ADMIN'
    }

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database to verify status
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      }
    })

    if (!user || user.status !== 'APPROVED') {
      return NextResponse.json({ error: 'User not found or not approved' }, { status: 401 })
    }

    const users = await db.user.findMany({
      include: {
        registration: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the response to include registration details
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      phone: user.phone,
      country: user.country,
      city: user.city,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      registration: user.registration ? {
        id: user.registration.id,
        motivation: user.registration.motivation,
        fieldCategory: user.registration.fieldCategory,
        hasExperience: user.registration.hasExperience,
        experienceDescription: user.registration.experienceDescription,
        teamworkFeelings: user.registration.teamworkFeelings,
        futureGoals: user.registration.futureGoals,
        skills: user.registration.skills,
        otherSkills: user.registration.otherSkills,
        hobbies: user.registration.hobbies,
        availabilityDays: user.registration.availabilityDays,
        availabilityHours: user.registration.availabilityHours,
        linkedin: user.registration.linkedin,
        github: user.registration.github,
        createdAt: user.registration.createdAt,
        updatedAt: user.registration.updatedAt
      } : null
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}