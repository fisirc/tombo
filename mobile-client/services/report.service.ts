import { Tables, TablesInsert } from "@/types/supabase";
import { supabase } from "./supabase";
import { MediaAsset } from "@/types";
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
    mediaAssets: MediaAsset[]
  ): Promise<Tables<"reports">> => {
    const query = supabase.from("reports").insert(report).select().single();
    const { data: reportData, error } = await query;
    if (error) throw error;

    for (let i = 0; i < mediaAssets.length; i++) {
      const asset = mediaAssets[i];

      if (!asset.uri) throw new Error("No uri found in media asset");
      if (!asset.mimeType) throw new Error("No mimeType found in media asset");

      const filePath = `${reportData.id}/image_${i}`;

      console.log("uploading file", asset.fileName ?? filePath, "to", filePath);

      const resp = await fetch(asset.uri);
      const fileBody = await resp.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("reports-media")
        .upload(filePath, fileBody, {
          contentType: asset.mimeType,
          upsert: false,
        });

      if (uploadError) {
        Alert.alert("Upload Error", "Error al subir imagen " + asset.fileName);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("reports-media").getPublicUrl(filePath);

      console.log("file uploaded, public url:", publicUrl);

      const { error: dbError } = await supabase
        .from("multimedia_reports")
        .insert({
          resource: publicUrl,
          type: asset.mimeType,
          report_id: reportData.id,
        });

      if (dbError) {
        Alert.alert(
          "Database Error",
          "Error al registrar imagen " + (asset.fileName ?? filePath)
        );
        throw dbError;
      }
    }

    return reportData;
  };

  static getReports = async (): Promise<FullReport[]> => {
    const query = supabase
      .from("reports")
      .select(
        `
          *,
          multimedia_reports(*)
        `
      )
      .is("process_end", null);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };
}
