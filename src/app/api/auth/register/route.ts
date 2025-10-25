import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { writeFile } from 'fs/promises'
import path from 'path'
import { mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract personal details
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const gender = formData.get('gender') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const country = formData.get('country') as string
    const city = formData.get('city') as string
    const password = formData.get('password') as string
    
    // Extract research & motivation details
    const motivation = formData.get('motivation') as string
    const fieldCategory = formData.get('fieldCategory') as string
    const hasExperience = formData.get('hasExperience') === 'true'
    const experienceDescription = formData.get('experienceDescription') as string
    const teamworkFeelings = formData.get('teamworkFeelings') as string
    const futureGoals = formData.get('futureGoals') as string
    const skills = JSON.parse(formData.get('skills') as string || '[]')
    const otherSkills = formData.get('otherSkills') as string
    const hobbies = formData.get('hobbies') as string
    const availabilityDays = parseInt(formData.get('availabilityDays') as string)
    const availabilityHours = parseInt(formData.get('availabilityHours') as string)
    const linkedin = formData.get('linkedin') as string
    const github = formData.get('github') as string
    
    // Handle profile photo upload
    const profilePhoto = formData.get('profilePhoto') as File | null
    let profilePhotoPath: string | null = null
    
    if (profilePhoto && profilePhoto.size > 0) {
      const bytes = await profilePhoto.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Generate unique filename
      const fileName = `${Date.now()}-${profilePhoto.name}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
      const filePath = path.join(uploadDir, fileName)
      
      // Ensure directory exists
      mkdirSync(uploadDir, { recursive: true })
      
      // Write file
      await writeFile(filePath, buffer)
      profilePhotoPath = `/uploads/profiles/${fileName}`
    }

    // Validate required fields
    if (!name || !email || !password || !phone || !gender || !dateOfBirth || !country || !city) {
      return NextResponse.json({ error: 'All personal details are required' }, { status: 400 })
    }

    if (!motivation || !fieldCategory || !teamworkFeelings || !futureGoals || !hobbies || !availabilityDays || !availabilityHours) {
      return NextResponse.json({ error: 'All research and motivation details are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with PENDING status
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        country,
        city,
        profilePhoto: profilePhotoPath,
        status: 'PENDING',
        role: 'MEMBER' // Default role for new registrations
      }
    })

    // Create user registration details
    await db.userRegistration.create({
      data: {
        userId: user.id,
        motivation,
        fieldCategory,
        hasExperience,
        experienceDescription,
        teamworkFeelings,
        futureGoals,
        skills: Array.isArray(skills) ? skills.join(', ') : skills, // Convert array to comma-separated string
        otherSkills,
        hobbies,
        availabilityDays,
        availabilityHours,
        linkedin,
        github
      }
    })

    // Create notification for admin
    await db.notification.create({
      data: {
        type: 'NEW_REGISTRATION',
        title: 'New User Registration',
        message: `New user ${name} has registered and is pending approval.`,
        userId: user.id
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}