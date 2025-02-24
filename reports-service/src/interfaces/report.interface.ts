export interface IReport {
  id: string
  latitude: string
  longitude: string
  description: string
  date: Date
  userId: string
  reportTypeId: string
}

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
