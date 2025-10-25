import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createOptimizedResponse } from '@/lib/performance'

export async function GET() {
  try {
    const settings = await db.homepageSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!settings) {
      const fallbackData = {
        heroTitle: "Welcome to Arive Lab",
        heroSubtitle: "Innovating the Future of Automotive Research",
        heroCtaText: "Join Now",
        heroCtaLink: "/register",
        bannerImage: null,
        bannerVideo: null,
        seoTitle: "Arive Lab - Automotive Research Innovation",
        seoDescription: "Leading the future of automotive research and innovation"
      }
      return createOptimizedResponse(fallbackData)
    }

    return createOptimizedResponse(settings)
  } catch (error) {
    console.error('Error fetching homepage settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const existingSettings = await db.homepageSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    let settings
    if (existingSettings) {
      settings = await db.homepageSettings.update({
        where: { id: existingSettings.id },
        data: body
      })
    } else {
      settings = await db.homepageSettings.create({
        data: body
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating homepage settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}