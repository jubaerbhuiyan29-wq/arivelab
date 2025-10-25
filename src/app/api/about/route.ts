import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const about = await db.about.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!about) {
      return NextResponse.json({
        title: "About Arive Lab",
        description: "Arive Lab is at the forefront of automotive research and innovation, pioneering the future of transportation through cutting-edge technology and groundbreaking research.",
        image: null
      })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error fetching about info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const existingAbout = await db.about.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    let about
    if (existingAbout) {
      about = await db.about.update({
        where: { id: existingAbout.id },
        data: body
      })
    } else {
      about = await db.about.create({
        data: body
      })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error updating about info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}