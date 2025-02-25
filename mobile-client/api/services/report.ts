import { ReportForm } from "@/types";

export const ReportService = {
  createReport: async (data: ReportForm) => {
    console.log('Report created:', data)
  }
}
