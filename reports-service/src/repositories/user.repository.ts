import { PrismaClient } from '@prisma/client';
import type { IUser, IPreferences } from '@/interfaces/user.interface';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise <IUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async create(user: Omit<IUser, 'id'>, preferences: Omit<IPreferences, 'id'>) {
    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  }

  async update(id: string, user: Partial<IUser>, preferences?: Partial<IPreferences>) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: user,
      include: { preferences: true }
    });
  }
}
