import type { ReportRepository } from '@/repositories/report.repository'
import type { IReport, IReportRepository, IReportService } from '../interfaces/report.interface'

export class ReportService implements IReportService {
  constructor(
    private readonly reportRepository: ReportRepository
  ) {}

  async createReport(report: Omit<IReport, 'id'>): Promise<IReport> {
    return this.reportRepository.create(report)
  }

  async getReportById(id: string): Promise<IReport> {
    const report = await this.reportRepository.findById(id)
    if (!report) {
      throw new Error('Report not found')
    }
    return report
  }

  async getAllReports(): Promise<IReport[]> {
    return this.reportRepository.findAll()
  }

  async updateReport(id: string, report: Partial<IReport>): Promise<IReport> {
    return this.reportRepository.update(id, report)
  }

  async deleteReport(id: string): Promise<void> {
    await this.reportRepository.delete(id)
  }
}
