import { redis } from '@/redis';

export class ReportEvents {
  async publishReportCreated(report: any) {
      await redis.publish('reports:created', JSON.stringify(report));
    }
}
