import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const research = await db.research.findUnique({
      where: {
        id: params.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!research) {
      return NextResponse.json(
        { error: 'Research not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this research
    if (user.role !== 'ADMIN' && research.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json(research)
  } catch (error) {
    console.error('Error fetching research:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, image, categoryId, featured, published } = body

    // Check if research exists and user has permission
    const existingResearch = await db.research.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingResearch) {
      return NextResponse.json(
        { error: 'Research not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to edit this research
    if (user.role !== 'ADMIN' && existingResearch.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const research = await db.research.update({
      where: {
        id: params.id
      },
      data: {
        title: title !== undefined ? title : existingResearch.title,
        description: description !== undefined ? description : existingResearch.description,
        content: content !== undefined ? content : existingResearch.content,
        image: image !== undefined ? image : existingResearch.image,
        categoryId: categoryId !== undefined ? categoryId : existingResearch.categoryId,
        featured: featured !== undefined ? featured : existingResearch.featured,
        published: published !== undefined ? published : existingResearch.published
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(research)
  } catch (error) {
    console.error('Error updating research:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if research exists and user has permission
    const existingResearch = await db.research.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingResearch) {
      return NextResponse.json(
        { error: 'Research not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete this research
    if (user.role !== 'ADMIN' && existingResearch.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await db.research.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Research deleted successfully' })
  } catch (error) {
    console.error('Error deleting research:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}