import { commentSchema, type IComment } from '@/interfaces/comment.interface';
import type { ElysiaWS } from 'elysia/ws';
import { t, type Static } from 'elysia';
import { redis } from '@/redis';

const createdCommentPayload = t.Object({
  publisherId: t.Number(),
  commentData: commentSchema,
});

type CommentCreatedEventPayload = Static<typeof createdCommentPayload>;

type WSCommentClient = {
  ws: ElysiaWS,
  reportId: string,
}

export const wsCommentsClientsMap = new Map<string, WSCommentClient>();

// Redis sub on reports

export const REDIS_REPORTS_CHANNEL = 'comments:created';

const redisSubscriber = await redis.duplicate().connect();

redisSubscriber.subscribe(REDIS_REPORTS_CHANNEL, (data) => {
  const commentData = JSON.parse(data) as CommentCreatedEventPayload;

  for (const { ws } of wsCommentsClientsMap.values()) {
    if (ws.id === commentData.publisherId) return;
    ws.send(JSON.stringify(commentData));
  }
});

export class CommentEvents {
  async publishReportCreated(comment: IComment) {
    await redis.publish(REDIS_REPORTS_CHANNEL, JSON.stringify(comment));
  }
}
