import { Elysia } from 'elysia'
import { PORT } from '@/env';
import { sql } from 'bun';
import { s3 } from 'bun';

new Elysia()
    .get('/', async () => {
        const rows = await sql`SELECT version()`;
        console.log(rows[0].version);
        return rows[0].version;
    })
    .get('/minio', async () => {
        const hash = Math.random().toString(36).substring(7);
        const filename = `test_${hash}.txt`;

        const f = s3.file(filename);
        await f.write(`🐢 working 🐢 - ${hash} `);
        return `🐢 ${filename} was created`;
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message} ❇️`);
        }
    })
    .listen(PORT);
