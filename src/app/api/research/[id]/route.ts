import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const researchId = params.id

    const research = await db.research.findUnique({
      where: {
        id: researchId,
        published: true
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
            name: true,
            email: true
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

    return NextResponse.json(research)
  } catch (error) {
    console.error('Error fetching research:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}