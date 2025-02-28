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
    const formData  = new FormData();
    console.log('posting report...', data);

    formData.append('latitude', data.location.latitude.toString());
    formData.append('longitude', data.location.longitude.toString());
    formData.append('description', data.description);
    if (data.location.address) {
      formData.append('address', data.location.address);
    }
    formData.append('reportType', data.reportType);
    for (const media of data.multimediaReports) {
      // @ts-ignore
      formData.append('multimediaReports', media);
    }

    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reports`, {
        method: 'POST',
        body: formData,
      });

      const reportData = await response.json();
      console.log('🚨 report data', reportData);
      return reportData;
    } catch (error) {
      console.error('Error creating report:', error);
    }
  },
  getAllReports: async () => {
    console.log(`url: ${process.env.EXPO_PUBLIC_API_URL}/api/reports`)
    const reports = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reports`);
    const reportsData = await reports.json();
    console.log('🚨 reports data', reportsData);
    return reportsData as IReportResponse[];
  },
  getReport: async (id: string) => {
    const report = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reports/${id}`);
    const reportData = await report.json();
    return reportData as IReportResponse;
  }
}
