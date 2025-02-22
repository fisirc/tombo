import { Elysia } from 'elysia'
import { PORT } from '@/env';
import { sql } from 'bun';
import { minio } from './minio';
import { redis } from './redis';
import { ReportService } from './services/report.service';
import { ReportRepository } from './repositories/report.repository';
import { ReportEvents } from './events/report.events';
import type { CreateReportDTO, ApiResponse, Report } from './interfaces/report.interface';

const reportRepository = new ReportRepository();
const reportEvents = new ReportEvents();
const reportService = new ReportService(reportRepository, reportEvents);

const app = new Elysia()
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
    .post('/reports', async (context): Promise<ApiResponse<Report>> => {
        console.log('📝 Creating new report:', context.body);
        try {
            const reportData = context.body as CreateReportDTO;
            const report = await reportService.createReport(reportData);
            console.log('✅ Report created successfully:', report);
            return { success: true, data: report };
        } catch (error) {
            const err = error as Error;
            console.error('❌ Error creating report:', err);
            context.set.status = 500;
            return { success: false, error: err.message };
        }
    })
    .get('/reports/:id', async (context): Promise<ApiResponse<Report>> => {
        console.log('📄 Fetching report:', context.params.id);
        try {
            const report = await reportService.getReport(context.params.id);
            if (!report) {
                context.set.status = 404;
                return { success: false, error: 'Report not found' };
            }
            return { success: true, data: report };
        } catch (error) {
            const err = error as Error;
            console.error('❌ Error fetching report:', err);
            context.set.status = 500;
            return { success: false, error: err.message };
        }
    })
    .ws('/echo', {
        message(ws, message) {
            ws.send(`❇️ ${message} ❇️`);
        }
    })
    .listen(6969);

export default app;
