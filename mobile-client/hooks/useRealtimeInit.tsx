import { supabase } from "@/services/supabase";
import { useQueryClient } from "@tanstack/react-query";
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
}
