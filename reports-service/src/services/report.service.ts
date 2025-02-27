import type { ReportRepository } from '@/repositories/report.repository'
import type { IReport, IReportResponse, IReportService } from '../interfaces/report.interface'
import { ReportEvents } from '../events/report.events';
import type { PushNotificationEvents } from '@/events/pushnotification.event';
import { publicS3Url } from '@/utils';

export class ReportService implements IReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reportEvents: ReportEvents,
    private readonly pushNotificationEvents: PushNotificationEvents,
  ) { }

  async createReport(reportData: Omit<IReport, 'id'>): Promise<IReportResponse> {
    const report = await this.reportRepository.create(reportData);
    // Publish to reports queue
    await this.reportEvents.publishReportCreated(report);
    // Publish the notification
    await this.pushNotificationEvents.sentPushNotification({
      title: `🚨 Reporte: ${report.reportType}`,
      message: report.description,
      externalUserIds: [], // send to all users
      image: publicS3Url(report.multimediaReports[0]?.resource),
    });
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
