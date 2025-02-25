import { Elysia, t } from 'elysia'
import { ReportService } from '../services/report.service'
import { ReportRepository } from '../repositories/report.repository'
import { createReportSchema } from '@/interfaces/report.interface'
import { ReportEvents } from '@/events/report.events'

const reportService = new ReportService(
  new ReportRepository(), new ReportEvents(),
);

export const reportController = new Elysia({ prefix: '/reports' })
  .get('/', async () => {
    return await reportService.getAllReports()
  })
  .get('/:id', async (req) => {
    console.log('📄 Fetching report:', req.params.id);
    try {
      const report = await reportService.getReportById(req.params.id);
      if (!report) {
        req.set.status = 404;
        return { error: 'Report not found' };
      }
      return report;
    } catch (error) {
      const err = error as Error;
      req.set.status = 500;
      return { error: err.message };
    }
  })
  .post('/',
    async (req) => {
      try {
        return reportService.createReport(req.body);
      } catch (error) {
        const err = error as Error;
        req.set.status = 500;
        return { error: err.message };
      }
    },
    {
      body: createReportSchema,
    }
  )
  .delete('/:id', async ({ params: { id } }) => {
    return await reportService.deleteReport(id)
  })
