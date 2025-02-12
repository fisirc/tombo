import { Elysia } from 'elysia'
import { PORT } from '@/env';
import { sql } from 'bun';

new Elysia()
    .get('/', async () => {
        const rows = await sql`SELECT version()`;
        console.log(rows[0].version);
        return rows[0].version;
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message} ❇️`);
        }
    })
    .listen(PORT);
