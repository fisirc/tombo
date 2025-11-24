import { Tables, TablesInsert } from "@/types/supabase";
import { supabase } from "./supabase";

export default class CommentService {
  static getReportComments = async (
    report_id: string
  ): Promise<Tables<"comments">[]> => {
    const query = supabase
      .from("comments")
      .select("*")
      .eq("report_id", report_id)
      .order("created_at", { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  static addCommentToReport = async (
    { report_id, message, user_id }: TablesInsert<'comments'>
  ): Promise<Tables<"comments">> => {
    const query = supabase
      .from("comments")
      .insert({ report_id, message, user_id })
      .select()
      .single();
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
