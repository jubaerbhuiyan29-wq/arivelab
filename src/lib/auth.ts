import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface DecodedToken {
  userId: string
  email: string
  role: 'MEMBER' | 'ADMIN'
  iat: number
  exp: number
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<DecodedToken | null> {
  const token = await getToken()
  if (!token) return null
  
  return decodeToken(token)
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

export async function isMember(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'MEMBER'
}