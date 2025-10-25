import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const coreValues = await db.coreValue.findMany({
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json(coreValues)
  } catch (error) {
    console.error('Error fetching core values:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const coreValue = await db.coreValue.create({
      data: body
    })
    return NextResponse.json(coreValue)
  } catch (error) {
    console.error('Error creating core value:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}