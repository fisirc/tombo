import { t, type Static } from 'elysia';

export const reportSchema = t.Object({
  id: t.String(),
  latitude: t.String(),
  longitude: t.String(),
  description: t.String(),
  date: t.Date(),
  userId: t.String(),
  reportTypeId: t.String(),
});

export const createReportSchema = t.Omit(reportSchema, ['id']);

export type IReport = Static<typeof reportSchema>;

export interface IReportRepository {
  create(report: Omit<IReport, 'id'>): Promise<IReport>
  findById(id: string): Promise<IReport | null>
  findAll(): Promise<IReport[]>
  update(id: string, report: Partial<IReport>): Promise<IReport>
  delete(id: string): Promise<void>
}

export interface IReportService {
  createReport(report: Omit<IReport, 'id'>): Promise<IReport>
  getReportById(id: string): Promise<IReport>
  getAllReports(): Promise<IReport[]>
  updateReport(id: string, report: Partial<IReport>): Promise<IReport>
  deleteReport(id: string): Promise<void>
}
export type ApiResponse<T> = {
  error?: string;
} | T;
