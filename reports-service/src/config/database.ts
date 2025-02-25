import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()

export async function setupDatabase() {
  try {
    await db.$connect();
    console.log('✅ Database connected successfully');

    const admin = await db.user.upsert({
      where: { googleId: 'admin-id' },
      update: {},
      create: {
        googleId: 'admin-id',
        email: 'admin@tombo.pe',
        name: 'Admin',
        avatar: 'https://minio.tombo.paoloose.site/public/default-avatar.jpg',
        phone: '123456789',
      },
      include: {
        preferences: true,
      }
    });

    console.log('👤 Admin user:', admin);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);

  }
}
