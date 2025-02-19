import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

export class ReportEvents {
  async publishReportCreated(report: any) {
      await redisClient.publish('reports:created', JSON.stringify(report));
    }
}
