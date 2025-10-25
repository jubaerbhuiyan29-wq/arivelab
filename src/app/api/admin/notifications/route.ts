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

    // Fetch all notifications with user details
    const notifications = await db.notification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get notification counts
    const unreadCount = notifications.filter(n => !n.isRead).length
    const newRegistrationCount = notifications.filter(n => n.type === 'NEW_REGISTRATION' && !n.isRead).length

    return NextResponse.json({
      notifications,
      unreadCount,
      newRegistrationCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    const { notificationIds, markAsRead } = await request.json()

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: 'Invalid notification IDs' }, { status: 400 })
    }

    // Update notifications
    await db.notification.updateMany({
      where: {
        id: {
          in: notificationIds
        }
      },
      data: {
        isRead: markAsRead
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}