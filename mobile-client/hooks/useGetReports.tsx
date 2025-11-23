import ReportService from "@/services/report.service";
import { supabase } from "@/services/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    supabase
      .channel("reports")
      .on("broadcast", { event: "report_created" }, () =>
        queryClient.invalidateQueries({ queryKey: ["reports"] })
      );
  }, []);
  return useQuery({
    queryKey: ["reports"],
    queryFn: ReportService.getReports,
  });
};
