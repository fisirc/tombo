import type { Context } from 'elysia';
import { ReportService } from '../services/report.service';

export class ReportController {
  constructor(private reportService: ReportService) {}
  public async createReport(context: Context) {
    const { title, content } = context.body as { title: string; content: string };
    const report = await this.reportService.createReport({ title, content });
    return report;
  }
  async getReport(context: Context) {
    const { id } = context.params;
    const report = await this.reportService.getReport(id);
    return report;
  }
}
