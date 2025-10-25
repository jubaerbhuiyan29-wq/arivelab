import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string; action: string } }
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

    const { userId, action } = params

    // Validate action
    const validActions = ['approve', 'reject', 'suspend']
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get the target user details for notification
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Map actions to status and notification types
    const statusMap = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      suspend: 'SUSPENDED'
    }

    const notificationMap = {
      approve: 'USER_APPROVED',
      reject: 'USER_REJECTED',
      suspend: 'USER_SUSPENDED'
    }

    const notificationMessages = {
      approve: `Your account has been approved! Welcome to Arive Lab.`,
      reject: `Your account registration has been rejected.`,
      suspend: `Your account has been suspended.`
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        status: statusMap[action as keyof typeof statusMap] as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Create notification for the user
    await db.notification.create({
      data: {
        type: notificationMap[action as keyof typeof notificationMap] as any,
        title: `Account ${action.charAt(0).toUpperCase() + action.slice(1)}ed`,
        message: notificationMessages[action as keyof typeof notificationMessages],
        userId: targetUser.id
      }
    })

    // If user was rejected, mark the new registration notification as read
    if (action === 'reject') {
      await db.notification.updateMany({
        where: {
          userId: targetUser.id,
          type: 'NEW_REGISTRATION',
          isRead: false
        },
        data: {
          isRead: true
        }
      })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}