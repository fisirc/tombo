import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()

export async function setupDatabase() {
  try {
    await db.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}
