import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@arivelab.com' },
    update: {},
    create: {
      email: 'admin@arivelab.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      phone: '+1234567890',
      gender: 'prefer-not-to-say',
      dateOfBirth: new Date('1990-01-01'),
      country: 'United States',
      city: 'New York'
    },
  })

  console.log('Admin user created:', admin.email)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })