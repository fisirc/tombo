import { redis } from '@/redis';

type NotificationEventPayload = {
    title: string,
    message: string,
    image?: string,
    externalUserIds: string[],
}

export const REDIS_NOTIFICATIONS_CHANNEL = 'notifications';

export class NotificationsEvent {
  async sentPushNotification(comment: NotificationEventPayload) {
    await redis.publish(REDIS_NOTIFICATIONS_CHANNEL, JSON.stringify(
      comment satisfies NotificationEventPayload
    ));
  }
}
