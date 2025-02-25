import { Elysia, t } from 'elysia'
import { PORT } from '@/env';
import { minio } from './minio';
import { redis } from './redis';
import { reportController } from './controllers/report.controller';
import { setupDatabase } from './config/database';
import { wsReportsClientsMap } from './events/report.events';
import swagger from '@elysiajs/swagger';

await setupDatabase()

const app = new Elysia()
    .use(swagger())
    .get('/healthz', async () => {
        return 'All systems operational'
    })
    .get('/minio', async () => {
        const hash = Math.random().toString(36).substring(7)
        const filename = `test_${hash}.txt`

        const f = minio.file(filename)
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
    .ws('/reports', {
        body: t.Object({
            message: t.String()
        }),
        open(ws) {
            wsReportsClientsMap.set(ws.id, { ws });
        },
        close(ws) {
            wsReportsClientsMap.delete(ws.id);
        },
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message} ❇️`)
        }
    })
    .group('/api', app => app
        .use(reportController)
    );

app.listen(PORT, () => {
    console.log(`🦊 Server running on port ${PORT}`)
});
