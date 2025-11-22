import { Tables, TablesInsert } from "@/types/supabase";
import { supabase } from "./supabase";

export default class ReportService {
  static createReport = async (formData: TablesInsert<'reports'>): Promise<Tables<'reports'>> => {
    const query = supabase
      .from('reports')
      .insert(formData)
      .select()
      .single()
    const { data, error } = await query
    if (error) throw error
    return data
  }
}
