import { Tables, TablesInsert } from "@/types/supabase";
import { supabase } from "./supabase";

export default class ReportService {
  static createReport = async (
    report: TablesInsert<"reports">
  ): Promise<Tables<"reports">> => {
    const query = supabase.from("reports").insert(report).select().single();
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };
}
