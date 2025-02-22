import { createClient } from 'redis';
import { REDIS_URL } from './env';

export const redis = await createClient({
    url: REDIS_URL,
  })
  .on('error', (err) => console.error('Redis error: ', err))
  .connect();
