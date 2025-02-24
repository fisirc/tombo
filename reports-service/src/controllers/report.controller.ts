import { Elysia, t } from 'elysia'
import { ReportService } from '../services/report.service'
import { ReportRepository } from '../repositories/report.repository'
import type { IReport } from '@/interfaces/report.interface'

const reportRepository = new ReportRepository()
const reportService = new ReportService(reportRepository)

export const reportController = new Elysia({ prefix: '/reports' })
  .get('/', async () => {
    return await reportService.getAllReports()
  })
  .get('/:id', async ({ params: { id } }) => {
    return await reportService.getReportById(id)
  })
  .post('/',
    async ({ body }) => {
      return await reportService.createReport(body as Omit<IReport, 'id'>)
    },
    {
      body: t.Object({
        latitude: t.String(),
        longitude: t.String(),
        description: t.String(),
        date: t.Date(),
        userId: t.String(),
        reportTypeId: t.String()
      })
    }
  )
  .put('/:id',
    async ({ params: { id }, body }) => {
      return await reportService.updateReport(id, body as Partial<IReport>)
    },
    {
      body: t.Partial(t.Object({
        latitude: t.String(),
        longitude: t.String(),
        description: t.String(),
        date: t.Date(),
        userId: t.String(),
        reportTypeId: t.String()
      }))
    }
  )
  .delete('/:id', async ({ params: { id } }) => {
    return await reportService.deleteReport(id)
  })
