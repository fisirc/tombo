import ReportService from "@/services/report.service";
import { useQuery } from "@tanstack/react-query";

export default () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: ReportService.getReports,
  });
};
