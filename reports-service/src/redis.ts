import { createClient } from 'redis';
import { REDIS_URL } from './env';

// docs: https://github.com/redis/node-redis/tree/master/packages/redis

export const redis = await createClient({
    url: REDIS_URL,
  })
  .on('error', (err) => console.error('Redis error: ', err))
  .connect();
