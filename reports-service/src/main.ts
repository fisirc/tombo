import { Elysia } from 'elysia'
import { DATABASE_URL, PORT } from '@/env';
import { neon } from "@neondatabase/serverless";

const sql = neon(DATABASE_URL);

new Elysia()
    .get('/', async () => {
        const rows = await sql`SELECT version()`;
        console.log(rows[0].version);
        return rows[0].version;
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message}`);
        }
    })
    .listen(PORT);
