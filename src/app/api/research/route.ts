import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createOptimizedResponse } from '@/lib/performance'
import jwt from 'jsonwebtoken'
import { writeFile } from 'fs/promises'
import path from 'path'
import { mkdirSync } from 'fs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const authorId = searchParams.get('authorId')

    const whereClause: any = {}
    
    if (featured === 'true') {
      whereClause.featured = true
      whereClause.published = true
    } else if (authorId) {
      // Show all items for the author (including drafts)
      whereClause.authorId = authorId
    } else {
      whereClause.published = true
    }

    // Optimized query with only necessary fields
    const research = await db.research.findMany({
      where: whereClause,
      include: {
        images: {
          where: {
            isFeatured: true
          },
          take: 1,
          select: {
            imageUrl: true,
            altText: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
        // Removed author select for homepage to reduce data
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return createOptimizedResponse(research)
  } catch (error) {
    console.error('Error fetching research:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const video = formData.get('video') as string
    const tags = formData.get('tags') as string
    const published = formData.get('published') === 'true'
    const authorId = formData.get('authorId') as string
    
    // Handle multiple image uploads
    const images = formData.getAll('images') as File[]
    let imagePaths: string[] = []
    
    for (const image of images) {
      if (image.size > 0) {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const fileName = `${Date.now()}-${image.name}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'research')
        const filePath = path.join(uploadDir, fileName)
        
        // Ensure directory exists
        mkdirSync(uploadDir, { recursive: true })
        
        // Write file
        await writeFile(filePath, buffer)
        imagePaths.push(`/uploads/research/${fileName}`)
      }
    }

    // Create research item
    const research = await db.research.create({
      data: {
        title,
        description,
        categoryId: categoryId || null,
        content: description, // Using description as content for now
        image: imagePaths[0] || null, // Use first image as main image
        published,
        featured: false,
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(research, { status: 201 })
  } catch (error) {
    console.error('Error creating research:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}