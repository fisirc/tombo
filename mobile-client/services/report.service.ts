import { Tables, TablesInsert } from "@/types/supabase";
import { supabase } from "./supabase";
import { LocalMedia } from "@/types";
import { Alert } from "react-native";
import { QueryData } from "@supabase/supabase-js";

const getReportsQuery = supabase
  .from("reports")
  .select(
    `
    *,
    multimedia_reports(*)
  `
  )
  .single();

export type FullReport = QueryData<typeof getReportsQuery>;

export default class ReportService {
  static createReport = async (
    report: TablesInsert<"reports">,
    media: LocalMedia[]
  ): Promise<Tables<"reports">> => {
    const query = supabase.from("reports").insert(report).select().single();
    const { data: reportData, error } = await query;
    if (error) throw error;

    media.forEach(async (file, i) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `image_${i}.${fileExt}`;
      const filePath = `${report.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("reports-media")
        .upload(filePath, await fetch(file.uri).then((res) => res.blob()), {
          upsert: true,
        });

      if (uploadError) {
        Alert.alert("Upload Error", "Error al subir imagen " + file.name);
        throw uploadError;
      }

      const { data: imageData } = supabase.storage
        .from("reports-media")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("multimedia_reports")
        .insert({
          report_id: reportData.id,
          resource: imageData.publicUrl,
          type: file.type,
        });

      if (dbError) {
        Alert.alert("Database Error", "Error al registrar imagen " + file.name);
        throw dbError;
      }
    });

    return reportData;
  };

  static getReports = async (): Promise<FullReport[]> => {
    const query = supabase.from("reports").select(
      `
        *,
        multimedia_reports(*)
      `
    );
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };
}
