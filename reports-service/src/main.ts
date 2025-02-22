import { Elysia } from 'elysia'
import { PORT } from '@/env';
import { sql } from 'bun';
import { minio } from './minio';
import { redis } from './redis';

new Elysia()
    .get('/', async () => {
        const rows = await sql`SELECT version()`;
        console.log(rows[0].version);
        return rows[0].version;
    })
    // TODO health check
    // TODO queue integration
    .get('/minio', async () => {
        const hash = Math.random().toString(36).substring(7);
        const filename = `test_${hash}.txt`;

        const f = minio.file(filename);
        await f.write(`🐢 working 🐢 - ${hash} `);
        return `🐢 ${filename} was created`;
    })
    .get('/redis/set/:key/:value', async ({ params }) => {
        await redis.set(params.key, params.value);
        return `🔑 ${params.key} set to ${params.value}`;
    })
    .get('/redis/get/:key', async ({ params }) => {
        const value = await redis.get(params.key);
        return `🔑 ${params.key} is ${value}`;
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message} ❇️`);
        }
    })
    .listen(PORT);
