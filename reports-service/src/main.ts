import { Elysia, t } from 'elysia'
import { PORT } from '@/env';
import { bucket } from './minio';
import { redis } from './redis';
import { reportController } from './controllers/report.controller';
import { setupDatabase } from './config/database';
import { commentController } from './controllers/comment.controller';
import swagger from '@elysiajs/swagger';
import crypto from 'crypto'
import querystring from 'querystring'
import { authController } from './controllers/auth.controller';

await setupDatabase()

const app = new Elysia()
    .use(swagger({
        path: '/openapi',
    }))
    .get('/healthz', async () => {
        return 'All systems operational'
    })
    .get('/minio', async () => {
        const hash = Math.random().toString(36).substring(7)
        const filename = `test_${hash}.txt`

        const f = bucket.file(filename)
        await f.write(`🐢 working 🐢 - ${hash} `)
        return `🐢 ${filename} was created`
    })
    .get('/redis/set/:key/:value', async ({ params }) => {
        await redis.set(params.key, params.value)
        return `🔑 ${params.key} set to ${params.value}`
    })
    .get('/redis/get/:key', async ({ params }) => {
        const value = await redis.get(params.key)
        return `🔑 ${params.key} is ${value}`
    })
    .get('/redis/publish/:channel/:message', async ({ params }) => {
        await redis.publish(params.channel, params.message)
        return `📡 ${params.message} published to ${params.channel}`
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message} ❇️`)
        }
    })
    .use(authController)
    .group('/api', app => app
        .use(reportController)
        .use(commentController)
    );

app.listen(PORT, () => {
    console.log(`🦊 Server running on port ${PORT}`)
});
