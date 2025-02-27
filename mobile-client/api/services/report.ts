import { ReportForm } from "@/types";

export type IReportResponse = {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  createdAt: Date;
  userId: string;
  reportType: string;
  address: string;
  multimediaReports: {
    id: string;
    createdAt: Date;
    resource: string;
    type: string;
    reportId: string;
  }[];
};

export const ReportService = {
  createReport: async (data: ReportForm) => {
    console.log('Report created:', data)
  },
  getAllReports: async () => {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/api/reports`)
    const reports = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reports`);
    const reportsData = await reports.json();
    console.log('🚨 reports data', reportsData);
    return reportsData as IReportResponse[];
  }
}
