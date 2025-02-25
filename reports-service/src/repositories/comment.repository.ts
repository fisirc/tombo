import { PrismaClient } from '@prisma/client'
import type { IComment, ICommentRepository } from '../interfaces/comment.interface'

export class CommentRepository implements ICommentRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async create(comment: Omit<IComment, 'id' | 'date' | 'userId'>): Promise<IComment> {
    return this.prisma.comment.create({
      data: {
        message: comment.message,
        report: {
          connect: { id: comment.reportId },
        },
        user: {
          connect: { email: 'admin@tombo.pe' },
        },
        date: new Date()
      },
    })
  }

  async findById(id: string): Promise<IComment | null> {
    return this.prisma.comment.findUnique({
      where: { id }
    })
  }

  async findAllByReport(reportId: string): Promise<IComment[]> {
    return this.prisma.comment.findMany({
      where: { reportId }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id }
    })
  }
}
