import { type IReportResponse } from '@/interfaces/report.interface';
import type { ElysiaWS } from 'elysia/ws';
import { redis } from '@/redis';

type ReportCreatedEventPayload = IReportResponse;

type WSReportClient = {
  ws: ElysiaWS,
  lat?: number,
  lon?: number,
}

export const wsReportsClientsMap = new Map<string, WSReportClient>();

// Redis sub on reports

export const REDIS_REPORTS_CHANNEL = 'reports:created';

const redisSubscriber = await redis.duplicate().connect();

redisSubscriber.subscribe(REDIS_REPORTS_CHANNEL, (data) => {
  const reportData = JSON.parse(data) as ReportCreatedEventPayload;
  console.log(`📨 ${REDIS_REPORTS_CHANNEL}:`, data);

  for (const { ws } of wsReportsClientsMap.values()) {
    console.log('> notifying ws client:', ws.id);
    ws.send(JSON.stringify(reportData));
  }
});

export class ReportEvents {
  async publishReportCreated(report: IReportResponse) {
    await redis.publish(REDIS_REPORTS_CHANNEL, JSON.stringify(
      report satisfies ReportCreatedEventPayload
    ));
  }
}
