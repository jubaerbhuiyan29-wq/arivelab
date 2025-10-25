import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const socialLinks = await db.socialLink.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(socialLinks)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const socialLink = await db.socialLink.create({
      data: body
    })
    return NextResponse.json(socialLink)
  } catch (error) {
    console.error('Error creating social link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}