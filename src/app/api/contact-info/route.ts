import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const contactInfo = await db.contactInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!contactInfo) {
      return NextResponse.json({
        email: 'contact@arivelab.com',
        phone: '+1 (555) 123-4567',
        address: '123 Innovation Drive, Tech City, TC 12345',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.123456789!2d-74.123456789!2f3!2f20.123456789!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjAuMTIzNDU2Nzg5LCAtNzQuMTIzNDU2Nzg5'
      })
    }

    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const existingContactInfo = await db.contactInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    let contactInfo
    if (existingContactInfo) {
      contactInfo = await db.contactInfo.update({
        where: { id: existingContactInfo.id },
        data: body
      })
    } else {
      contactInfo = await db.contactInfo.create({
        data: body
      })
    }

    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}