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

    const project = await db.project.findUnique({
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

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this project
    if (user.role !== 'ADMIN' && project.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
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

    // Check if project exists and user has permission
    const existingProject = await db.project.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to edit this project
    if (user.role !== 'ADMIN' && existingProject.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const project = await db.project.update({
      where: {
        id: params.id
      },
      data: {
        title: title !== undefined ? title : existingProject.title,
        description: description !== undefined ? description : existingProject.description,
        content: content !== undefined ? content : existingProject.content,
        image: image !== undefined ? image : existingProject.image,
        categoryId: categoryId !== undefined ? categoryId : existingProject.categoryId,
        featured: featured !== undefined ? featured : existingProject.featured,
        published: published !== undefined ? published : existingProject.published
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

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
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

    // Check if project exists and user has permission
    const existingProject = await db.project.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete this project
    if (user.role !== 'ADMIN' && existingProject.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await db.project.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}