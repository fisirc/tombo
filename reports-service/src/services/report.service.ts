import type { ReportRepository } from '@/repositories/report.repository'
import type { IReport, IReportService } from '../interfaces/report.interface'
import { ReportEvents } from '../events/report.events';

export class ReportService implements IReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reportEvents: ReportEvents,
  ) { }

  async createReport(reportData: Omit<IReport, 'id'>): Promise<IReport> {
    const report = await this.reportRepository.create(reportData);
    await this.reportEvents.publishReportCreated(report);
    return report;
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
