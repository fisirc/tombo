import { PrismaClient } from '@prisma/client'
import type { IReport, IReportRepository } from '../interfaces/report.interface'

export class ReportRepository implements IReportRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async create(report: Omit<IReport, 'id'>): Promise<IReport> {
    return this.prisma.report.create({
      data: report
    })
  }

  async findById(id: string): Promise<IReport | null> {
    return this.prisma.report.findUnique({
      where: { id }
    })
  }

  async findAll(): Promise<IReport[]> {
    return this.prisma.report.findMany()
  }

  async update(id: string, report: Partial<IReport>): Promise<IReport> {
    return this.prisma.report.update({
      where: { id },
      data: report
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({
      where: { id }
    })
  }
}
