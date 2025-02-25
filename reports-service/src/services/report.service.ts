import type { ReportRepository } from '@/repositories/report.repository'
import type { IReport, IReportResponse, IReportService } from '../interfaces/report.interface'
import { ReportEvents } from '../events/report.events';

export class ReportService implements IReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reportEvents: ReportEvents,
  ) { }

  async createReport(reportData: Omit<IReport, 'id'>): Promise<IReportResponse> {
    const report = await this.reportRepository.create(reportData);
    await this.reportEvents.publishReportCreated(report);
    return report;
  }

  async getReportById(id: string): Promise<IReportResponse> {
    const report = await this.reportRepository.findById(id)
    if (!report) {
      throw new Error('Report not found')
    }
    return report
  }

  async getAllReports(): Promise<IReportResponse[]> {
    return this.reportRepository.findAll()
  }

  async deleteReport(id: string): Promise<void> {
    await this.reportRepository.delete(id)
  }
}
