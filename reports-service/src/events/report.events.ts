import { reportSchema, type IReport } from '@/interfaces/report.interface';
import type { ElysiaWS } from 'elysia/ws';
import { t, type Static } from 'elysia';
import { redis } from '@/redis';

const createdReportPayload = t.Object({
  publisherId: t.Number(),
  reportData: reportSchema,
});

type ReportCreatedEventPayload = Static<typeof createdReportPayload>;

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
  // TODO: validate
  const reportData = JSON.parse(data) as ReportCreatedEventPayload;

  for (const { ws } of wsReportsClientsMap.values()) {
    if (ws.id === reportData.publisherId) return;
    ws.send(JSON.stringify(reportData));
  }
});

export class ReportEvents {
  async publishReportCreated(report: IReport) {
    // TODO: only publish meaningful data, not all the report
    // TODO: move to top level function
    await redis.publish(REDIS_REPORTS_CHANNEL, JSON.stringify(report));
  }
}
