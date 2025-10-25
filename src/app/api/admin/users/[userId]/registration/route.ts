import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params

    // Get user with registration details
    const userDetails = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        country: true,
        city: true,
        profilePhoto: true,
        status: true,
        role: true,
        createdAt: true,
        registration: true
      }
    })

    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userDetails)
  } catch (error) {
    console.error('Error fetching user registration details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}