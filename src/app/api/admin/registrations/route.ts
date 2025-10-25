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

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // PENDING, APPROVED, REJECTED, SUSPENDED
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { registration: {
            fieldCategory: { contains: search, mode: 'insensitive' }
          }
        }
      ]
    }

    // Get registrations with user details
    const registrations = await db.user.findMany({
      where,
      include: {
        registration: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get total count for pagination
    const total = await db.user.count({
      where
    })

    // Format the response
    const formattedRegistrations = registrations.map(reg => ({
      id: reg.id,
      name: reg.name,
      email: reg.email,
      phone: reg.phone,
      gender: reg.gender,
      dateOfBirth: reg.dateOfBirth,
      country: reg.country,
      city: reg.city,
      profilePhoto: reg.profilePhoto,
      status: reg.status,
      role: reg.role,
      createdAt: reg.createdAt,
      updatedAt: reg.updatedAt,
      registration: reg.registration ? {
        id: reg.registration.id,
        motivation: reg.registration.motivation,
        fieldCategory: reg.registration.fieldCategory,
        hasExperience: reg.registration.hasExperience,
        experienceDescription: reg.registration.experienceDescription,
        teamworkFeelings: reg.registration.teamworkFeelings,
        futureGoals: reg.registration.futureGoals,
        skills: reg.registration.skills,
        otherSkills: reg.registration.otherSkills,
        hobbies: reg.registration.hobbies,
        availabilityDays: reg.registration.availabilityDays,
        availabilityHours: reg.registration.availabilityHours,
        linkedin: reg.registration.linkedin,
        github: reg.registration.github,
        createdAt: reg.registration.createdAt,
        updatedAt: reg.registration.updatedAt
      } : null
    }))

    return NextResponse.json({
      registrations: formattedRegistrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Delete user and related registration
    await db.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ success: true, message: 'User and registration deleted successfully' })

  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}