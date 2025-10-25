import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const milestones = await db.timelineMilestone.findMany({
      orderBy: [{ displayOrder: 'asc' }]
    })

    return NextResponse.json(milestones)
  } catch (error) {
    console.error('Error fetching timeline milestones:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status:500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const milestone = await db.timelineMilestone.create({
      data: body
    })
    return NextResponse.json(milestone)
  } catch (error) {
    console.error('Error creating timeline milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}