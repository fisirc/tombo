import { t, type Static } from 'elysia';

export const reportSchema = t.Object({
  id: t.String(),
  latitude: t.String(),
  longitude: t.String(),
  description: t.String(),
  reportType: t.String(),
  multimediaReports: t.Optional(
    t.Files({
      type: ['image/*', 'video/*'],
    }),
  ),
});

export const createReportSchema = t.Omit(reportSchema, ['id']);

export type IReport = Static<typeof reportSchema>;
export type IReportResponse = {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  date: Date;
  userId: string;
  reportType: string;
  address: string;
  multimediaReports: {
    id: string;
    date: Date;
    resource: string;
    type: string;
    reportId: string;
  }[];
};

export interface IReportRepository {
  create(report: Omit<IReport, 'id'>): Promise<IReportResponse>
  findById(id: string): Promise<IReportResponse | null>
  findAll(): Promise<IReportResponse[]>
  delete(id: string): Promise<void>
}

export interface IReportService {
  createReport(report: Omit<IReport, 'id'>): Promise<IReportResponse>
  getReportById(id: string): Promise<IReportResponse>
  getAllReports(): Promise<IReportResponse[]>
  deleteReport(id: string): Promise<void>
}
export type ApiResponse<T> = {
  error?: string;
} | T;
