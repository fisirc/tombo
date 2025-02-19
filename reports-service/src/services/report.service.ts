import { ReportRepository } from '../repositories/report.repository';
import { ReportEvents } from '../events/report.events';

export class ReportService {
  constructor(
    private reportRepository: ReportRepository,
    private reportEvents: ReportEvents
  ) {}
  async createReport(data: { title: string; content: string }) {
    const report = await this.reportRepository.createReport(data);
    await this.reportEvents.publishReportCreated(report);
    return report;
  }
  async getReport(id: string) {
    return this.reportRepository.getReportById(id);
  }
}
