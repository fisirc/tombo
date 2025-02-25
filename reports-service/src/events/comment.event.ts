import { type IComment } from '@/interfaces/comment.interface';
import type { ElysiaWS } from 'elysia/ws';
import { redis } from '@/redis';

type CommentCreatedEventPayload = IComment;

type WSCommentClient = {
  ws: ElysiaWS,
  reportId: string,
}

export const wsCommentsClientsMap = new Map<string, WSCommentClient>();

// Redis sub on reports

export const REDIS_COMMENTS_CHANNEL = 'comments:created';

const redisSubscriber = await redis.duplicate().connect();

redisSubscriber.subscribe(REDIS_COMMENTS_CHANNEL, (data) => {
  const commentData = JSON.parse(data) as CommentCreatedEventPayload;
  console.log(`📨 ${REDIS_COMMENTS_CHANNEL}:`, data);

  for (const client of wsCommentsClientsMap.values()) {
    console.log('> notifying ws client:', client.ws.id);
    if (commentData.reportId !== client.reportId) return;
    client.ws.send(JSON.stringify(commentData));
  }
});

export class CommentEvents {
  async publishCommentCreated(comment: IComment) {
    await redis.publish(REDIS_COMMENTS_CHANNEL, JSON.stringify(
      comment satisfies CommentCreatedEventPayload
    ));
  }
}
