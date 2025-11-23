import ReportService from "@/services/report.service"
import { useQuery } from "@tanstack/react-query"

export default () => useQuery({
  queryKey: ['reports'],
  queryFn: ReportService.getReports
})
