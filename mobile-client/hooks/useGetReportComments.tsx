import CommentService from "@/services/comment.service";
import ReportService from "@/services/report.service";
import { supabase } from "@/services/supabase";
import { TablesInsert } from "@/types/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default (report_id: string) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    supabase
      .channel("report:" + report_id + '/comments')
      .on("broadcast", { event: "comment_created" }, () =>
        queryClient.invalidateQueries({ queryKey: ["report", report_id, "comments"] })
      );
  }, []);
  return useQuery({
    queryKey: ["report", report_id, "comments"],
    queryFn: () => CommentService.getReportComments(report_id),
  });
};
